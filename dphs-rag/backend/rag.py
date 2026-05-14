import os
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
from evaluation import print_metrics

load_dotenv()

model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

vector_stores = {}
ACTIVE_REPORT = None
groq_client = None


def set_active_report(report_id):
    global ACTIVE_REPORT
    ACTIVE_REPORT = report_id


def get_llm():
    global groq_client
    from groq import Groq

    if groq_client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            return None
        groq_client = Groq(api_key=api_key)
        

    return groq_client


def structured_boost(query, chunk):
    score = 0
    for row in chunk["structured_data"]:
        if any(q in row["test"].lower() for q in query.split()):
            score += 3
    return score


def section_boost(section):
    important = ["IMPRESSION", "FINDINGS", "CBC", "RESULT"]
    return 2 if any(k in section.upper() for k in important) else 0


def numeric_density(text):
    return sum(c.isdigit() for c in text) / max(len(text), 1)


def create_vector_store(chunks, report_id):
    if not chunks:
        print("❌ No chunks extracted — skipping vector store")
        return

    texts = [c["text"] for c in chunks if c["text"].strip()]

    if not texts:
        print("❌ No valid text found in chunks")
        return

    embeddings = model.encode(texts)

    if len(embeddings.shape) == 1:
        embeddings = np.expand_dims(embeddings, axis=0)

    dim = embeddings.shape[1]

    index = faiss.IndexFlatL2(dim)
    index.add(np.array(embeddings).astype("float32"))

    vector_stores[report_id] = {
        "index": index,
        "chunks": chunks
    }

    print(f"✅ Vector store created with {len(chunks)} chunks")


def search(query, top_k=6):
    store = vector_stores.get(ACTIVE_REPORT)
    if not store:
        print("No active report loaded.")
        return []

    index = store["index"]
    chunks = store["chunks"]

    q_embed = model.encode([query]).astype("float32")
    _, indices = index.search(q_embed, top_k * 5)  # increased recall

    scored = []

    query_words = set(query.lower().split())

    for i in indices[0]:
        chunk = chunks[i]

        text = chunk["text"].lower()

        # 🔥 HARD FILTER (removes junk chunks)
        if len(text) < 40:
            continue

        # remove numeric-heavy garbage (OCR tables, noise)
        if sum(c.isdigit() for c in text) > len(text) * 0.5:
            continue

        text_words = set(text.split())

        # ✅ OPTIONAL (but recommended for better relevance)
        if len(query_words & text_words) == 0:
            continue

        # ✅ EXISTING SCORING (unchanged)
        keyword_score = len(query_words & text_words)

        score = (
            keyword_score * 2
            + structured_boost(query, chunk)
            + section_boost(chunk["section"])
            + numeric_density(chunk["text"])
        )

        scored.append((score, chunk))

    # 🔥 SAFETY FALLBACK (very important)
    if not scored:
        print("⚠️ No chunks after filtering — fallback triggered")
        return chunks[:top_k]

    scored = sorted(scored, key=lambda x: x[0], reverse=True)

    # keep more diversity for summary
    limit = top_k if top_k <= 10 else int(top_k * 0.8)

    return [c for _, c in scored[:limit]]


def build_context(results):
    context_parts = []

    for r in results:
        block = f"[Page {r['page']} | {r['section']}]\n{r['text']}"

        if r["structured_data"]:
            for row in r["structured_data"]:
                block += f"\n{row['test']} = {row['value']} {row['unit']}"

        context_parts.append(block)

    return "\n\n".join(context_parts)[:10000]


def call_llm(prompt):
    client = get_llm()
    if client is None:
        return "LLM not available"

    res = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "Clinical assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.2
    )

    return res.choices[0].message.content


def generate_report():
    results = search("full lab report all tests values findings impression", top_k=25)
    context = build_context(results)

    prompt = f"""
You are a clinical report analyzer.

Your task:
1. Identify ALL test categories present in the report.
2. Extract values and abnormalities for EACH category.
3. DO NOT ignore any page.
4. DO NOT say "not provided" unless completely absent.

STRICT RULES:
- Group results by test category (Complete Blood Count (CBC), Hematology, Lipid, Biochemistry, etc.)
- Do NOT mix categories
- If values appear anywhere in context, include them
- Use page references implicitly
- Do NOT infer or assume missing values

FORMAT:

1. Category Name:
- values:
- abnormalities:

Context:
{context}
"""

    answer = call_llm(prompt)
    print_metrics(results, "summary", answer, context)

    return answer


def ask_question(query):
    results = search(query)
    context = build_context(results)

    answer = call_llm(f"Answer from report:\n{context}\nQuestion:{query}")

    # 🔥 ADD CITATIONS
    citations = list(set([f"(Page {r['page']}, {r['section']})" for r in results]))

    print_metrics(results, query, answer, context)

    return answer + "\n\nSources: " + ", ".join(citations)