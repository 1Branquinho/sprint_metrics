from fastapi import FastAPI
from app.db.session import engine
from app.models.base import Base
import app.models
from app.api.sprints import router as sprints_router

app = FastAPI(title="Sprint Metrics MVP")

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

app.include_router(sprints_router)


#uvicorn app.main:app --reload --port 8000