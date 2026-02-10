from fastapi import FastAPI
from app.db.session import engine

app = FastAPI(title="Sprint Metrics MVP")

@app.on_event("startup")
def on_startup():
    engine.connect()

#uvicorn app.main:app --reload --port 8000