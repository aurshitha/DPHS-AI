def grounding_score(answer, context):
    answer_sentences = answer.lower().split(".")
    context = context.lower()

    supported = 0

    for sent in answer_sentences:
        if sent.strip() and any(word in context for word in sent.split()[:5]):
            supported += 1

    return round(supported / len(answer_sentences), 3) if answer_sentences else 0


def diversity_score(chunks):
    pages = set(c["page"] for c in chunks)
    return len(pages) / len(chunks) if chunks else 0


def print_metrics(chunks, query, answer, context):
    print("\n📊 METRICS")
    print("Chunks:", len(chunks))
    print("Diversity:", round(diversity_score(chunks), 3))
    print("Grounding:", grounding_score(answer, context))