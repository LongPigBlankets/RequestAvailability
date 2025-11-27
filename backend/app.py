from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import json

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "requests.json"

app = FastAPI(title="Request Records API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_data():
    if not DATA_PATH.exists():
        raise HTTPException(status_code=500, detail="Data source not found")
    with DATA_PATH.open("r", encoding="utf-8") as data_file:
        return json.load(data_file)


@app.get("/api/records")
def get_records():
    """Return all records for both tables."""
    return load_data()


@app.get("/api/records/{request_id}")
def get_record(request_id: str):
    """Return a single request across both tables."""
    data = load_data()
    status = next(
        (record for record in data.get("requestStatusTable", []) if record["RequestID"] == request_id),
        None,
    )
    schedule = next(
        (record for record in data.get("requestScheduleTable", []) if record["RequestID"] == request_id),
        None,
    )

    if not status and not schedule:
        raise HTTPException(status_code=404, detail="Request ID not found")

    return {"requestStatus": status, "requestSchedule": schedule}
