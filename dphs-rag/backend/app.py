from fastapi import FastAPI, UploadFile, File
import shutil
import os
import uuid

from ingestion import process_pdf
from rag import create_vector_store, generate_report, ask_question, set_active_report

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

CURRENT_REPORT = None


@app.post("/upload")
def upload(file: UploadFile = File(...)):
    global CURRENT_REPORT

    report_id = str(uuid.uuid4())
    path = f"{report_id}.pdf"

    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    chunks = process_pdf(path)
    create_vector_store(chunks, report_id)

    CURRENT_REPORT = report_id
    set_active_report(report_id)

    os.remove(path)

    return {"message": "Report uploaded successfully"}


@app.get("/generate-report")
def get_report():
    return generate_report()


@app.post("/ask")
def ask(query: str):
    return {"answer": ask_question(query)}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For now (dev only)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)