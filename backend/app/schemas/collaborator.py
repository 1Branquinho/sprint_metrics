from pydantic import BaseModel, ConfigDict

class CollaboratorCreate(BaseModel):
    name: str
    active: bool = True

class CollaboratorRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    active: bool
