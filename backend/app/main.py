from fastapi import FastAPI
from app.db.session import engine
from app.models.base import Base
import app.models

app = FastAPI(title="Sprint Metrics MVP")

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

#uvicorn app.main:app --reload --port 8000