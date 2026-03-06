import time
from typing import Any

_cache: dict[str, tuple[Any, float]] = {}


def get_cached(key: str) -> Any | None:
    data = _cache.get(key)
    if not data:
        return None

    value, expires_at = data

    if time.time() > expires_at:
        del _cache[key]
        return None

    return value


def set_cached(key: str, value: Any, ttl: int = 60) -> None:
    expires_at = time.time() + ttl
    _cache[key] = (value, expires_at)


def invalidate(key: str) -> None:
    if key in _cache:
        del _cache[key]
