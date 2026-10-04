import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from backend.app.core.config import settings
from backend.app.core.database import Base, engine, SessionLocal
from backend.app.services.seed_data import seed_database_if_empty

# Routers
from backend.app.api.v1.auth import router as auth_router
from backend.app.api.v1.taxonomy import router as taxonomy_router
from backend.app.api.v1.practice import router as practice_router
from backend.app.api.v1.tests import router as tests_router
from backend.app.api.v1.attempts import router as attempts_router
from backend.app.api.v1.analytics import router as analytics_router
from backend.app.api.v1.mistakes import router as mistakes_router
from backend.app.api.v1.bookmarks import router as bookmarks_router
from backend.app.api.v1.saved_questions import router as saved_questions_router
from backend.app.api.v1.admin import router as admin_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables are created and initial data is seeded
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database_if_empty(db)
    finally:
        db.close()
    yield
    # Shutdown logic if any

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Engineered for NEET-UG: Practice, Test, Analyze, and Target Weak Areas.",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# HEAD request middleware to gracefully support HEAD requests across all routes
class HeadRequestMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method == "HEAD":
            request.scope["method"] = "GET"
            response = await call_next(request)
            return Response(
                status_code=response.status_code,
                headers=dict(response.headers),
                media_type=response.media_type
            )
        return await call_next(request)

app.add_middleware(HeadRequestMiddleware)

# Register API routers with /api/v1 prefix
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(taxonomy_router, prefix=settings.API_V1_STR)
app.include_router(practice_router, prefix=settings.API_V1_STR)
app.include_router(tests_router, prefix=settings.API_V1_STR)
app.include_router(attempts_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)
app.include_router(mistakes_router, prefix=settings.API_V1_STR)
app.include_router(bookmarks_router, prefix=settings.API_V1_STR)
app.include_router(saved_questions_router, prefix=settings.API_V1_STR)
app.include_router(admin_router, prefix=settings.API_V1_STR)

@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy", "service": "Medicqube NEET Platform", "version": "1.0.0"}

# Mount frontend directory for immediate local preview
frontend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend")
if os.path.exists(frontend_dir):
    app.mount("/static", StaticFiles(directory=frontend_dir), name="static")

    @app.get("/")
    def serve_frontend_index():
        return FileResponse(
            os.path.join(frontend_dir, "index.html"),
            headers={
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0"
            }
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
