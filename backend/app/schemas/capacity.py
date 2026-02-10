from pydantic import BaseModel, ConfigDict

class CapacityCreate(BaseModel):
    sprint_number: int
    collaborator_id: int
    min_points: int
    expected_points: int

class CapacityRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    sprint_number: int
    collaborator_id: int
    min_points: int
    expected_points: int
