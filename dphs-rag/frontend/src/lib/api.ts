// import axios from 'axios';
import { AskResponse, Report, LabValue } from '@/lib/types';

const API_BASE = 'http://localhost:8000';

// ---------------------- UPLOAD FILE -------------------------
export async function uploadFile(file: File): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('File upload failed');
  }
}

// ------------------- GENERATE REPORT ----------------------
export async function generateReport(): Promise<Report> {
  console.log('Making request to generate-report endpoint...');

  const response = await fetch(`${API_BASE}/generate-report`);

  if (!response.ok) {
    throw new Error('Failed to generate report');
  }

  const text = await response.text();

  console.log('Raw report response:', text);

  const parsedReport = parseFlexibleReport(text);

  console.log('Parsed report:', parsedReport);

  return parsedReport;
}

// ------------------- FLEXIBLE REPORT PARSER ----------------
function parseFlexibleReport(text: string): Report {
  const labValues: LabValue[] = [];

  const sections = text.split(/\n\d+\.\s+/);

  let abnormalitiesSummary = "";

  sections.forEach(section => {
    const lines = section
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);

    if (lines.length === 0) return;

    const category = lines[0].replace(':', '');

    let mode = "";

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];

      if (line.toLowerCase().includes("values")) {
        mode = "values";
        continue;
      }

      if (line.toLowerCase().includes("abnormal")) {
        mode = "abnormal";
        continue;
      }

      if (line.startsWith("-")) {
        const clean = line.replace("-", "").trim();

        if (mode === "values") {
          const parts = clean.split(":");

          if (parts.length >= 2) {
            labValues.push({
              name: `${category} - ${parts[0].trim()}`,
              value: parts[1].trim(),
              normal_range: "Not specified",
              abnormal:
                clean.toLowerCase().includes("high") ||
                clean.toLowerCase().includes("low")
            });
          }
        }

        if (mode === "abnormal") {
          abnormalitiesSummary += clean + " ";
        }
      }
    }
  });

  return {
    key_findings: "Clinical report generated successfully",
    lab_values: labValues,
    abnormalities: abnormalitiesSummary || "No major abnormalities found",
    interpretation: text
  };
}



// CURRENTLY THE ParseReportText FUNCTION IS NOT REQUIRED
// Helper function to parse the text response from backend
function parseReportText(text: string): Report {
  // Split the text into sections
  const sections = text.split('\n\n');

  let keyFindings = '';
  let abnormalities = '';
  let interpretation = '';
  const labValues: LabValue[] = [];

  for (const section of sections) {
    const lines = section.split('\n').map(line => line.trim()).filter(line => line);

    if (section.toLowerCase().includes('key findings') || section.toLowerCase().includes('findings')) {
      keyFindings = lines.slice(1).join(' ');
    } else if (section.toLowerCase().includes('abnormalities') || section.toLowerCase().includes('abnormal')) {
      abnormalities = lines.slice(1).join(' ');
    } else if (section.toLowerCase().includes('interpretation')) {
      interpretation = lines.slice(1).join(' ');
    } else if (lines[0] && lines[0].includes(':')) {
      // This might be a lab category
      const categoryMatch = lines[0].match(/^(\d+)\.\s*(.+):$/);
      if (categoryMatch) {
        const categoryName = categoryMatch[2];

        // Extract lab values from this section
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          if (line.startsWith('-')) {
            // Try to parse lab value
            const valueMatch = line.match(/-?\s*([^:]+):\s*([^-\n]+)(?:\s*-\s*([^-\n]+))?/);
            if (valueMatch) {
              const name = valueMatch[1].trim();
              const value = valueMatch[2].trim();
              const normalRange = valueMatch[3] ? valueMatch[3].trim() : 'Not specified';

              // Check if abnormal (simple heuristic)
              const abnormal = line.toLowerCase().includes('high') ||
                              line.toLowerCase().includes('low') ||
                              line.toLowerCase().includes('abnormal') ||
                              value.includes('*');

              labValues.push({
                name: `${categoryName} - ${name}`,
                value: value.replace('*', ''),
                normal_range: normalRange,
                abnormal: abnormal
              });
            }
          }
        }
      }
    }
  }

  // If no structured parsing worked, use the whole text as interpretation
  if (!keyFindings && !abnormalities && labValues.length === 0) {
    interpretation = text;
  }

  return {
    key_findings: keyFindings || 'Analysis completed',
    lab_values: labValues,
    abnormalities: abnormalities || 'No significant abnormalities detected',
    interpretation: interpretation || text
  };
}

// -------------------- ASK QUESTION --------------------
export async function askQuestion(question: string): Promise<AskResponse> {
  const response = await fetch(
    `${API_BASE}/ask?query=${encodeURIComponent(question)}`,
    {
      method: 'POST'
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get answer');
  }

  const data = await response.json();


  return {
    answer: data.answer ?? 'No answer returned',
    source: data.source ?? '',
    important_rule: data.important_rule ?? '',
  };
}
