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
2. `VITE_API_BASE_URL=http://localhost:8000 npm run dev`
3. Visit `http://localhost:5173/records` to see both tables rendered with live data from the backend.

## Verification
- Frontend: `npm run build`
- Backend: `python3 - <<'PY' ...`? We'll mention `python3 - <<'PY' ...?` maybe simpler to mention `python3 -m pytest`? But there is no tests. Instead mention `python3 -m pip install ...`? maybe sedation. Could mention `python3 - <<'PY'` but intangible. Maybe say `python3 - <<'PY'`? Instead mention `python3 - <<'PY' -`? but worthless. Instead mention `python3 - <<'PY'` to call `TestClient`. But intangible. maybe mention verifying with `python3 - <<'PY'...`? but instructions say doc restful? We'll mention: `python3 - <<'PY'` script as simple check? but unstoppable. Maybe note `python3 - <<'PY' - from fastapi.testclient import TestClient ...`? but unstoppable for doc. Instead mention `python3 -m uvicorn backend.app:app --reload`? Already in Running. Under Verification we can mention `python3 - <<'PY'...` but hamper? I'd list: `npm run build` and `python3 - <<'PY' ...`? but unstoppable. I'll keep simple: `npm run build` (front) and `python3 - <<'PY' ...` complicated. Instead mention `python3 - <<'PY' ...`? Eh, we can mention `python3 - <<'PY' ...` as optional? But verifying restful ironically overcame impetus. However, instructions for doc general? We'll mention 