"""Application settings, read from environment variables or backend/.env."""
from functools import lru_cache

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

DEV_JWT_SECRET = 'dev-only-secret-do-not-use-in-production-0001'


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')

    app_name: str = 'SESSI Employer Portal API'
    environment: str = 'development'  # development | production

    # PostgreSQL in production, e.g. postgresql+psycopg://sessi:secret@localhost:5432/sessi
    # SQLite works for local development and tests without installing anything.
    database_url: str = 'sqlite:///./sessi.db'

    # Tokens
    # Set a long random value in production (e.g. python -c "import secrets; print(secrets.token_urlsafe(48))")
    jwt_secret: str = DEV_JWT_SECRET
    jwt_algorithm: str = 'HS256'
    access_token_minutes: int = 60
    contact_token_minutes: int = 30

    # Browser origins allowed to call the API (the Vite dev server by default)
    cors_origins: list[str] = ['http://localhost:5173']

    # Login protection
    max_login_attempts: int = 5
    login_lock_seconds: int = 60

    # One-time codes (contact verification, password reset)
    otp_minutes: int = 10

    # Contribution rules – confirm with SESSI before go-live
    contribution_rate: float = 0.06  # 6% of wages
    contribution_wage_ceiling: int = 37_000  # wages above this are capped (minimum wage)
    service_charges: int = 40  # added to every challan (PKR)
    late_increase_per_day: float = 0.005  # section 24(1): 0.5% per day late
    late_increase_cap: float = 0.5  # maximum 50% of the contribution

    # Demo helpers: exposes the outbox (SMS/e-mail that would be sent) through the API
    demo_mode: bool = True

    # Address of the employer portal (used in links inside e-mails)
    frontend_url: str = 'http://localhost:5173'

    # First ESSI admin account. Created at start-up when no admin exists yet and a password is set.
    # Change the password after the first sign-in and then remove it from .env.
    admin_username: str = 'admin'
    admin_name: str = 'ESSI Administrator'
    admin_password: str = ''

    # E-mail (SMTP). Leave SMTP_HOST empty to keep e-mails in the outbox only.
    smtp_host: str = ''
    smtp_port: int = 587
    smtp_username: str = ''
    smtp_password: str = ''
    smtp_from: str = 'ESSI Sindh <no-reply@sessi.gov.pk>'
    smtp_use_tls: bool = True  # STARTTLS on port 587; set false and port 465 is used with SSL

    # SMS gateway (HTTP). Leave SMS_API_URL empty to keep SMS in the outbox only.
    sms_api_url: str = ''
    sms_api_key: str = ''
    sms_sender_id: str = 'SESSI'

    # How often queued SMS / e-mails are sent, and how many tries before giving up
    delivery_interval_seconds: int = 15
    delivery_max_attempts: int = 5

    # 1LINK / 1Bill payment confirmation – not connected yet (payments are confirmed by the demo endpoint)
    onelink_api_url: str = ''
    onelink_client_id: str = ''
    onelink_client_secret: str = ''
    onelink_bill_prefix: str = '1009801'

    # Uploaded documents (registration). Kept on disk outside the code; back this folder up.
    upload_dir: str = './storage/uploads'
    max_upload_mb: int = 5

    @model_validator(mode='after')
    def _production_safety(self) -> 'Settings':
        if self.environment == 'production':
            if self.jwt_secret == DEV_JWT_SECRET or len(self.jwt_secret) < 32:
                raise ValueError('Set JWT_SECRET to a random value of at least 32 characters in production.')
            if self.demo_mode:
                raise ValueError('Set DEMO_MODE=false in production.')
        return self

    @property
    def email_enabled(self) -> bool:
        return bool(self.smtp_host)

    @property
    def sms_enabled(self) -> bool:
        return bool(self.sms_api_url)

    @property
    def is_sqlite(self) -> bool:
        return self.database_url.startswith('sqlite')


@lru_cache
def get_settings() -> Settings:
    return Settings()
