export interface LabValue {
  name: string;
  value: string;
  normal_range: string;
  abnormal: boolean;
}

export interface Report {
  key_findings: string;
  lab_values: LabValue[];
  abnormalities: string;
  interpretation: string;
}

export interface AskResponse {
  answer: string;
  source?: string;
  important_rule?: string;
}

export interface QueryMessage {
  question: string;
  response: AskResponse;
}

export type ProcessingState = 'idle' | 'uploading' | 'processing' | 'ready' | 'error';