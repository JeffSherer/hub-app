from fastapi import APIRouter, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi import HTTPException
import os, json
from datetime import datetime
import threading
import random

router = APIRouter()

JOBS_DIR = "jobs"
os.makedirs(JOBS_DIR, exist_ok=True)

def simulate_training(job_path: str):
    # Load job record
    with open(job_path, "r") as f:
        job = json.load(f)

    # Update status to "training"
    job["status"] = "training"
    with open(job_path, "w") as f:
        json.dump(job, f, indent=2)

    # Simulate delay
    def complete_training():
        # Inject fake metrics
        job["status"] = "done"
        job["metrics"] = {
            "accuracy": round(random.uniform(0.85, 0.98), 4),
            "loss": round(random.uniform(0.1, 0.3), 4),
            "duration": f"{random.randint(30, 90)}s"
        }
        with open(job_path, "w") as f:
            json.dump(job, f, indent=2)

    # Run training completion in 10 seconds
    threading.Timer(10, complete_training).start()

@router.post("/fine-tune/submit")
async def submit_fine_tune_job(
    model: str = Form(...),
    version: str = Form(...),
    dataset: UploadFile = Form(...)
):
    timestamp = datetime.utcnow().isoformat()
    dataset_path = os.path.join(JOBS_DIR, dataset.filename)
    with open(dataset_path, "wb") as f:
        f.write(await dataset.read())

    job_record = {
        "model": model,
        "version": version,
        "dataset": dataset_path,
        "timestamp": timestamp,
        "status": "submitted"
    }

    job_path = os.path.join(JOBS_DIR, f"{version}.json")
    if os.path.exists(job_path):
        raise HTTPException(status_code=409, detail="Job version already exists.")

    with open(job_path, "w") as f:
        json.dump(job_record, f, indent=2)

    simulate_training(job_path)

    return JSONResponse(content={"message": "Job submitted", "job": job_record})

@router.get("/fine-tune/jobs")
def get_all_jobs():
    jobs = []
    for filename in os.listdir(JOBS_DIR):
        if filename.endswith(".json"):
            with open(os.path.join(JOBS_DIR, filename), "r") as f:
                jobs.append(json.load(f))
    return {"jobs": sorted(jobs, key=lambda j: j["timestamp"], reverse=True)}
