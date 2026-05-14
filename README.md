# DPHS-AI: AI-Enabled Assistive Layer for Clinical Decision Support

## Overview

**DPHS-AI (Dynamic Patient Health Synthesis using AI)** is a prototype clinical decision support system that uses **Retrieval-Augmented Generation (RAG)** to synthesize fragmented medical records and generate actionable clinical insights.

The project addresses the challenge of healthcare professionals spending significant time reviewing scattered patient documents such as laboratory reports, prescriptions, and diagnostic records before making clinical decisions.

The current implementation focuses on building the **core AI assistive layer**, where medical reports are processed, converted into searchable embeddings, retrieved based on relevance, and passed to a Large Language Model (LLM) to generate structured summaries and answer clinical queries.

This project demonstrates how AI can assist clinicians by reducing manual review time and improving accessibility of patient information.

---

# Problem Statement

Healthcare data is often distributed across multiple reports, visits, and departments, making it difficult for clinicians to quickly identify critical abnormalities and trends.

### Current Challenges:
- Fragmented patient medical records  
- Time-consuming manual review of reports  
- Lack of unified clinical summarization systems  
- Risk of overlooking abnormal values  
- Existing AI tools are often disconnected from real clinical workflows  

DPHS-AI addresses these challenges through an intelligent retrieval and summarization pipeline.

---

# Current Features (Implemented)

✅ Upload medical PDF reports  

✅ Extract text from:
- Text-based PDFs  
- Scanned PDFs using OCR (**Tesseract OCR**)  

✅ Medical report preprocessing and chunking  

✅ Page-level metadata preservation  

✅ Embedding generation using:
- `all-MiniLM-L6-v2`

✅ Vector storage using:
- `FAISS`

✅ Hybrid retrieval mechanism:
- Semantic similarity search  
- Keyword matching  
- Structured data boosting  
- Section weighting  
- Numeric density scoring  

✅ Context stitching across multiple report pages  

✅ Final actionable report generation  

✅ Clinical Question Answering (QA) over uploaded reports  

✅ FastAPI backend integration  

✅ Next.js frontend dashboard  

---

# System Architecture

The project follows two major phases:

## 1. Indexing Phase
- Upload medical report  
- PDF text extraction  
- OCR for scanned documents  
- Text cleaning  
- Chunk generation  
- Metadata tagging  
- Embedding generation  
- FAISS vector storage  

---

## 2. Retrieval + Generation Phase
- User query/report request  
- Relevant chunk retrieval  
- Context construction  
- Prompt engineering  
- LLM generation  
- Final clinical response  

---

# Tech Stack

## Backend
- Python  
- FastAPI  
- FAISS  
- Sentence Transformers  
- PyMuPDF  
- Tesseract OCR  

## Frontend
- Next.js  
- TypeScript  
- Tailwind CSS  

## LLM Integration
- Groq API  

---

# Project Workflow

1. User uploads medical report  
2. PDF text extraction begins  
3. OCR processes scanned reports  
4. Text preprocessing is performed  
5. Report is divided into chunks  
6. Embeddings are generated  
7. Data is stored in FAISS vector database  
8. User requests summary or asks a question  
9. Relevant chunks are retrieved  
10. Labeled context is sent to the LLM  
11. Final response is generated  

---

# Evaluation Metrics

The RAG system is currently evaluated using:

## Grounding Score
Measures whether generated responses are supported by retrieved context.

**Purpose:** Helps reduce hallucinations.

---

## Diversity Score
Measures how many different report pages are used during retrieval.

**Purpose:** Helps evaluate retrieval coverage.

---

# Current Limitations

- Primarily optimized for laboratory reports  
- Limited multimodal healthcare data integration  
- No EHR/Hospital system integration yet  
- Generic outputs require deeper clinical personalization  
- Medical ontology integration not yet implemented  
- Limited longitudinal patient tracking  

---

# Future Work / Ongoing Development

The current system is a working prototype focused on validating the feasibility of AI-assisted clinical decision support.

Future implementation includes:

- Integration with Electronic Health Records (EHR) systems  
- Medical ontology integration (**SNOMED CT, ICD, UMLS**)  
- Multi-visit patient timeline analysis  
- Prescription analysis  
- Radiology report integration  
- Pharmacy workflow integration  
- Lab staff workflow integration  
- Patient-facing dashboard  
- Fine-tuned clinical LLMs  
- Improved hallucination mitigation  
- Real-time hospital workflow deployment  

---

# Frontend Interface

The project includes an interactive dashboard with:

- Drag-and-drop medical report upload  
- Processing status tracker  
- Structured report generation  
- Interactive question-answering panel  
- AI-generated response display  
- Source visibility panel  

---

# Research Motivation

Studies indicate that clinicians spend substantial time navigating fragmented healthcare systems. Research also shows that a significant percentage of healthcare professionals are open to AI-assisted systems, but current tools remain disconnected from real workflow environments.

DPHS-AI was developed as a prototype to demonstrate how RAG can bridge this gap.

---

# Project Status

### Current Status: Working Prototype

✅ Core RAG pipeline completed  

✅ Frontend interface completed  

🚧 Clinical workflow ecosystem integration — Ongoing/Future Work  

---

<!--# Disclaimer

This project is developed for academic and research purposes only. It is not intended for direct clinical deployment without proper medical validation, regulatory approval, and healthcare supervision.-->
