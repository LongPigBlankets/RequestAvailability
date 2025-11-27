# RequestAvailability
Request availability, a few days at a time

## Architecture
- **Frontend:** React + Vite application under `src/` that renders the customer experience, including the `/records` page that shows the booking/request tables.
- **Backend:** FastAPI service under `backend/` that reads `backend/data/requests.json` and exposes the data via REST so other services (and the frontend) always hit the same source of truth.

## Running locally
### Backend
1. `python3 -m pip install -r backend/requirements.txt`
2. `uvicorn backend.app:app --reload --port 8000`

The API exposes `GET /api/records` for both tables plus `GET /api/records/{requestId}` for a single request.

### Frontend
1. `npm install`
2. `npm run dev` (the dev server proxies `/api/*` to `http://localhost:8000` automatically)
   - Set `VITE_API_BASE_URL` if your backend runs on a different host/port.
3. Visit `http://localhost:5173/records` to see both tables rendered with live data from the backend.

## Verification
- Frontend: `npm run build`
- Backend quick check:
  ```bash
  python3 - <<'PY'
  from fastapi.testclient import TestClient
  from backend.app import app

  client = TestClient(app)
  response = client.get("/api/records")
  response.raise_for_status()
  print("Records available:", response.json().keys())
  PY
  ```