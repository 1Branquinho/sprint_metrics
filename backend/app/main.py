from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.settings import settings
from app.db.session import engine
from app.models.base import Base
import app.models
from app.api.sprints import router as sprints_router
from app.api.collaborators import router as collaborators_router
from app.api.capacity import router as capacities_router
from app.api.issues import router as issues_router
from app.api.metrics import router as metrics_router

app = FastAPI(title="Sprint Metrics MVP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sprints_router)
app.include_router(collaborators_router)
app.include_router(capacities_router)
app.include_router(issues_router)
app.include_router(metrics_router)

#python -m uvicorn app.main:app --reload --port 8000
