from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.config import settings
from app.db.database import create_database_tables
from app.routers import health, mice, profiles, rag, recommendations


def create_app(create_tables: bool = True) -> FastAPI:
    @asynccontextmanager
    async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
        if create_tables:
            create_database_tables()

        yield

    app = FastAPI(title=settings.app_name, lifespan=lifespan)

    app.include_router(health.router, prefix=settings.api_prefix)
    app.include_router(mice.router, prefix=settings.api_prefix)
    app.include_router(profiles.router, prefix=settings.api_prefix)
    app.include_router(rag.router, prefix=settings.api_prefix)
    app.include_router(recommendations.router, prefix=settings.api_prefix)
    return app


app = create_app()
