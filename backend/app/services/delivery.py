"""Sends queued SMS / e-mails from the outbox.

Every message is first saved in `outbox_messages` (see notify.send_message). When SMTP_HOST or SMS_API_URL
is set in .env, a background worker sends queued messages every DELIVERY_INTERVAL_SECONDS and retries
failures up to DELIVERY_MAX_ATTEMPTS times. Without them, messages stay in the outbox only.

SMS gateways in Pakistan differ in their request format. `_send_sms` posts JSON
{"to": "923001234567", "from": SMS_SENDER_ID, "message": "..."} with "Authorization: Bearer SMS_API_KEY";
change that one function to match your provider's API document.
"""
import json
import logging
import smtplib
import threading
import urllib.request
from email.message import EmailMessage

from sqlalchemy import or_, select

from app.core.config import get_settings
from app.db.base import utcnow
from app.db.session import SessionLocal
from app.models import OutboxMessage
from app.services.formatting import digits

log = logging.getLogger('sessi.delivery')

QUEUED, SENT, FAILED, OUTBOX_ONLY = 'queued', 'sent', 'failed', 'outbox'


def initial_status(address: str | None, channel_enabled: bool) -> str | None:
    if not address:
        return None
    return QUEUED if channel_enabled else OUTBOX_ONLY


def _send_email(to: str, subject: str, body: str) -> None:
    s = get_settings()
    msg = EmailMessage()
    msg['From'] = s.smtp_from
    msg['To'] = to
    msg['Subject'] = subject
    msg.set_content(body + f'\n\nEmployer Portal: {s.frontend_url}')
    if s.smtp_use_tls:
        with smtplib.SMTP(s.smtp_host, s.smtp_port, timeout=20) as server:
            server.starttls()
            if s.smtp_username:
                server.login(s.smtp_username, s.smtp_password)
            server.send_message(msg)
    else:
        with smtplib.SMTP_SSL(s.smtp_host, s.smtp_port, timeout=20) as server:
            if s.smtp_username:
                server.login(s.smtp_username, s.smtp_password)
            server.send_message(msg)


def _send_sms(mobile: str, text: str) -> None:
    s = get_settings()
    number = digits(mobile)
    if number.startswith('0'):
        number = '92' + number[1:]
    payload = json.dumps({'to': number, 'from': s.sms_sender_id, 'message': text}).encode()
    req = urllib.request.Request(s.sms_api_url, data=payload, method='POST',
                                 headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {s.sms_api_key}'})
    with urllib.request.urlopen(req, timeout=20) as res:  # noqa: S310 (URL comes from our own settings)
        if res.status >= 300:
            raise RuntimeError(f'SMS gateway answered {res.status}')


def deliver_pending(limit: int = 50) -> int:
    """Send up to `limit` queued messages. Returns how many were handled."""
    s = get_settings()
    with SessionLocal() as db:
        rows = db.scalars(
            select(OutboxMessage)
            .where(or_(OutboxMessage.sms_status == QUEUED, OutboxMessage.email_status == QUEUED))
            .where(OutboxMessage.attempts < s.delivery_max_attempts)
            .order_by(OutboxMessage.id).limit(limit)
        ).all()
        for m in rows:
            m.attempts += 1
            errors = []
            if m.email_status == QUEUED and m.email:
                try:
                    _send_email(m.email, m.subject, m.body)
                    m.email_status = SENT
                except Exception as exc:  # noqa: BLE001 – any failure is retried later
                    errors.append(f'e-mail: {exc}')
            if m.sms_status == QUEUED and m.mobile:
                try:
                    _send_sms(m.mobile, m.body)
                    m.sms_status = SENT
                except Exception as exc:  # noqa: BLE001
                    errors.append(f'SMS: {exc}')
            if errors:
                m.last_error = '; '.join(errors)[:300]
                if m.attempts >= s.delivery_max_attempts:
                    m.email_status = FAILED if m.email_status == QUEUED else m.email_status
                    m.sms_status = FAILED if m.sms_status == QUEUED else m.sms_status
                log.warning('Message %s not delivered: %s', m.id, m.last_error)
            if QUEUED not in (m.email_status, m.sms_status):
                m.sent = SENT in (m.email_status, m.sms_status)
                m.sent_at = utcnow() if m.sent else None
            db.commit()
        return len(rows)


class DeliveryWorker:
    """Background thread that calls deliver_pending() regularly. Started by the app when a gateway is set."""

    def __init__(self) -> None:
        self._stop = threading.Event()
        self._thread: threading.Thread | None = None

    def start(self) -> None:
        self._thread = threading.Thread(target=self._run, name='sessi-delivery', daemon=True)
        self._thread.start()

    def stop(self) -> None:
        self._stop.set()
        if self._thread:
            self._thread.join(timeout=5)

    def _run(self) -> None:
        interval = get_settings().delivery_interval_seconds
        while not self._stop.is_set():
            try:
                deliver_pending()
            except Exception:  # noqa: BLE001 – keep the worker alive
                log.exception('Delivery run failed')
            self._stop.wait(interval)
