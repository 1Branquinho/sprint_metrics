import os

from pydantic import BaseModel


class Settings(BaseModel):
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./app.db")
    cors_origins: list[str] = ["http://localhost:5173"]


settings = Settings()
