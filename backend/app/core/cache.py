import time

_cache = {}

def get_cached(key: str):
    data = _cache.get(key)
    if not data:
        return None

    value, expires_at = data

    if time.time() > expires_at:
        del _cache[key]
        return None

    return value

def set_cached(key: str, value, ttl: int = 60):
    expires_at = time.time() + ttl
    _cache[key] = (value, expires_at)

def invalidate(key: str):
    if key in _cache:
        del _cache[key]