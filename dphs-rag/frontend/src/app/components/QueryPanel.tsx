'use client';

import { useState, useRef } from 'react';

interface QueryPanelProps {
  onQuery: (question: string) => Promise<void>;
  disabled: boolean;
}

const suggestions = [
  'What are abnormalities?',
  'What possible conditions can be inferred?',
  'Summarize this report clinically',
];

const QueryPanel: React.FC<QueryPanelProps> = ({ onQuery, disabled }) => {
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef<any>(null);

  // 🎤 VOICE FUNCTION
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in this browser (use Chrome)');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;

      // 👉 fill input
      setInput(transcript);

      // 🔥 AUTO SEND (you can disable if needed)
      await onQuery(transcript);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;
    await onQuery(input.trim());
    setInput('');
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3">

        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-wide">
            Ask Questions
          </h2>
          <p className="mt-1 text-sm text-slate-500 tracking-wide">
            Type or speak your clinical query.
          </p>
        </div>

        {/* INPUT + BUTTONS */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">

          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={disabled}
            placeholder="Ask clinical question..."
            className="min-w-0 flex-1 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500"
          />

          {/* 🎤 MIC BUTTON */}
          <button
            type="button"
            onClick={startListening}
            disabled={disabled}
            className={`relative flex items-center justify-center rounded-2xl px-4 py-3 font-medium transition-all duration-200 ${
              listening
                ? 'bg-rose-100 text-rose-600 border border-rose-300 shadow-sm'
                : 'bg-slate-200 text-slate-700 border border-slate-300 hover:bg-slate-300'
            }`}
          >
            <span className={`${listening ? 'animate-pulse' : ''}`}>
              🎙️
            </span>
          </button>

          {/* SEND */}
          <button
            type="submit"
            disabled={disabled}
            className="inline-flex items-center justify-center rounded-2xl bg-[#0066CC] px-5 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-[#0052A3] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Send
          </button>

        </form>

        {/* SUGGESTIONS */}
        <div className="grid gap-2 sm:grid-cols-3">
          {suggestions.map((question) => (
            <button
              key={question}
              type="button"
              disabled={disabled}
              onClick={() => onQuery(question)}
              className="rounded-2xl border border-slate-200 bg-[#F1F5F9] px-4 py-3 text-left text-sm text-slate-700 transition hover:border-[#0066CC] hover:bg-[#0066CC]/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {question}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};

export default QueryPanel;