from fastapi import HTTPException

def not_found(entity: str) -> HTTPException:
    return HTTPException(status_code=404, detail=f"{entity} not found")

def conflict(message: str) -> HTTPException:
    return HTTPException(status_code=409, detail=message)

def bad_request(message: str) -> HTTPException:
    return HTTPException(status_code=400, detail=message)
