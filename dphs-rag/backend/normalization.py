import re

# -------------------------------
# PATIENT DETAILS
# -------------------------------
def extract_patient_details(text):
    age = re.search(r'Age[:\s]*([0-9]+)', text, re.IGNORECASE)
    sex = re.search(r'Sex[:\s]*(Male|Female)', text, re.IGNORECASE)
    pid = re.search(r'(PID|Patient ID)[:\s]*([A-Za-z0-9]+)', text, re.IGNORECASE)

    return {
        "age": age.group(1) if age else "Not found",
        "sex": sex.group(1) if sex else "Not found",
        "id": pid.group(2) if pid else "Not found"
    }


# -------------------------------
# GENERIC TEST EXTRACTION
# -------------------------------
def extract_tests(text):
    lines = text.split("\n")

    tests = []

    for line in lines:
        match = re.search(
            r'([A-Za-z\s\(\)]+)\s+([<>]?\d+\.?\d*)\s*([a-zA-Z/%]+)?',
            line
        )

        if match:
            name = match.group(1).strip()
            value = match.group(2)
            unit = match.group(3) if match.group(3) else ""

            tests.append({
                "name": name,
                "value": value,
                "unit": unit
            })

    return tests


# -------------------------------
# DETECT ABNORMAL VALUES
# -------------------------------
def detect_abnormalities(tests):
    abnormal = []

    for t in tests:
        name = t["name"].lower()

        try:
            value = float(t["value"])
        except:
            continue

        # Generic thresholds (expandable)
        if "hemoglobin" in name and value < 13:
            abnormal.append(f"{t['name']} Low")

        elif "wbc" in name and value > 11000:
            abnormal.append(f"{t['name']} High")

        elif "glucose" in name and value > 126:
            abnormal.append(f"{t['name']} High")

        elif "platelet" in name and value < 150000:
            abnormal.append(f"{t['name']} Low")

    return abnormal