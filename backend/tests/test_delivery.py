"""SMS / e-mail delivery from the outbox (the real gateway calls are replaced by fakes)."""
from sqlalchemy import select

from app.core.config import get_settings
from app.models import OutboxMessage
from app.services import delivery
from app.services.notify import send_message


def _queue(db, monkeypatch, sms: bool, email: bool) -> OutboxMessage:
    s = get_settings()
    monkeypatch.setattr(s, 'sms_api_url', 'https://sms.example/send' if sms else '')
    monkeypatch.setattr(s, 'smtp_host', 'smtp.example' if email else '')
    send_message(db, 'Test', 'ESSI Sindh: hello', '0300-1234567', 'a@b.example')
    db.commit()
    return db.scalars(select(OutboxMessage).order_by(OutboxMessage.id.desc())).first()


def test_without_gateways_messages_stay_in_outbox(db, monkeypatch):
    m = _queue(db, monkeypatch, sms=False, email=False)
    assert (m.sms_status, m.email_status) == ('outbox', 'outbox')
    assert delivery.deliver_pending() == 0


def test_sent_and_retried(db, monkeypatch):
    sent = []
    monkeypatch.setattr(delivery, '_send_email', lambda to, subject, body: sent.append(('email', to)))

    def flaky_sms(mobile, text):
        raise RuntimeError('gateway down')

    monkeypatch.setattr(delivery, '_send_sms', flaky_sms)
    monkeypatch.setattr(get_settings(), 'delivery_max_attempts', 2)
    m = _queue(db, monkeypatch, sms=True, email=True)

    assert delivery.deliver_pending() == 1
    db.refresh(m)
    assert m.email_status == 'sent' and m.sms_status == 'queued' and m.attempts == 1 and 'gateway down' in m.last_error
    assert sent == [('email', 'a@b.example')]

    assert delivery.deliver_pending() == 1  # second and last try
    db.refresh(m)
    assert m.sms_status == 'failed' and m.sent is True and m.sent_at is not None
    assert delivery.deliver_pending() == 0
