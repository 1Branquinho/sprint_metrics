from fastapi import FastAPI
from app.db.session import engine
from app.models.base import Base
import app.models
from app.api.sprints import router as sprints_router
from app.api.collaborators import router as collaborators_router
from app.api.capacity import router as capacities_router
from app.api.issues import router as issues_router

app = FastAPI(title="Sprint Metrics MVP")

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

app.include_router(sprints_router)
app.include_router(collaborators_router)
app.include_router(capacities_router)
app.include_router(issues_router)

#uvicorn app.main:app --reload --port 8000