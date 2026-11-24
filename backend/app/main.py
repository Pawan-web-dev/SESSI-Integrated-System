"""SESSI Employer Portal API. Run: uvicorn app.main:app --reload --port 8000  (docs at /docs)."""
import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse

from app.api.v1.router import api_router
from app.core.config import get_settings
from app.create_admin import ensure_first_admin
from app.services.delivery import DeliveryWorker
from app.services.errors import ServiceError

settings = get_settings()
log = logging.getLogger('uvicorn.error')


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    try:
        message = ensure_first_admin()
        if message:
            log.warning(message)
    except Exception as exc:  # noqa: BLE001 – e.g. tables not created yet (run: alembic upgrade head)
        log.warning('Could not check the first admin account: %s', exc)
    worker = None
    if settings.email_enabled or settings.sms_enabled:
        worker = DeliveryWorker()
        worker.start()
        log.info('SMS / e-mail delivery started (e-mail: %s, SMS: %s).', settings.email_enabled, settings.sms_enabled)
    else:
        log.info('No SMTP or SMS gateway set in .env - messages stay in the outbox.')
    yield
    if worker:
        worker.stop()


app = FastAPI(
    lifespan=lifespan,
    title=settings.app_name,
    version='1.0.0',
    description='Employer registration, Employer Identification Numbers, contributions, payments and change requests for SESSI.',
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.exception_handler(ServiceError)
async def service_error_handler(_request: Request, exc: ServiceError) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content={'detail': exc.message})


@app.get('/', include_in_schema=False)
def root() -> RedirectResponse:
    """Opening the bare address shows the API documentation."""
    return RedirectResponse('/docs')


@app.get('/health', tags=['System'])
def health() -> dict:
    return {'status': 'ok'}


app.include_router(api_router, prefix='/api/v1')
