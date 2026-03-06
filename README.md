# Sprint Metrics

Backend FastAPI para acompanhar capacidade e performance de sprint.

## Stack
- FastAPI
- SQLAlchemy
- Alembic
- SQLite (default)
- Pytest

## Estrutura
- `backend/app/api`: endpoints
- `backend/app/services`: regras de negocio
- `backend/app/repositories`: acesso a dados
- `backend/app/models`: modelos ORM
- `backend/app/schemas`: contratos de entrada/saida
- `backend/app/analytics`: calculo de metricas
- `backend/alembic`: migrations

## Rodando localmente
1. Entre na pasta `backend`
2. Crie e ative uma venv
3. Instale dependencias com `requirements.txt`
4. Aplique migrations
5. Suba a API

Exemplo de comandos (Windows PowerShell):

```powershell
cd backend
.\.venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
python -m uvicorn app.main:app --reload --port 8000
```

## Testes
```powershell
cd backend
.\.venv\Scripts\python.exe -m pytest -q
```

## Observacoes
- As migrations em `backend/alembic/versions` sao a fonte de verdade do schema.
- O enum de status de issue esperado no banco eh:
  - `TODO`
  - `DOING`
  - `CODE REVIEW`
  - `TESTING`
  - `DONE`
