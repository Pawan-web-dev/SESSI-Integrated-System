from fastapi import APIRouter

from app.api.v1.endpoints import admin, employer, partner, public

api_router = APIRouter()
api_router.include_router(public.router)
api_router.include_router(employer.router)
api_router.include_router(admin.router)
api_router.include_router(partner.router)
