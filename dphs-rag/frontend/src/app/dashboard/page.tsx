'use client';

import Link from 'next/link';
import { Report, QueryMessage } from '@/lib/types';

import { useState } from 'react';
import Header from '../components/Header';
import Upload from '../components/Upload';
import ReportView from '../components/ReportView';
import QueryPanel from '../components/QueryPanel';
import ResponsePanel from '../components/ResponsePanel';
import ProcessingStatus from '../components/ProcessingStatus';
import SourceDisplay from '../components/SourceDisplay';
import { askQuestion, uploadFile, generateReport } from '@/lib/api';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'generate' | 'ask'>('generate');
  const [report, setReport] = useState<Report | null>(null);
  const [messages, setMessages] = useState<QueryMessage[]>([]);
  const [status, setStatus] = useState('idle');
  const [source, setSource] = useState('');

  const handleFileUpload = async (file: File) => {
    setStatus('uploading');
    await uploadFile(file);

    // 🔥 RESET OLD STATE
    setMessages([]);     // clear previous questions
    setReport(null);     // clear old report
    setSource('');       // clear old source

    setStatus('ready');
  };

  const handleGenerateReport = async () => {
    setStatus('processing');
    const r = await generateReport();
    setReport(r);

    // 🔥 RESET AGAIN (SAFE PRACTICE)
    setMessages([]);
    setSource('');

    setStatus('ready');
    setActiveTab('ask');
  };

  const handleQuery = async (q: string) => {
    setStatus('processing');
    const res = await askQuestion(q);
    setMessages((prev) => [{ question: q, response: res }, ...prev]);
    setSource(res.source || '');
    setStatus('ready');
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 text-slate-900">

      <div className="max-w-5xl mx-auto px-4">

        <Header />

        <div className="mt-4">
          <ProcessingStatus status={status} />
        </div>

        {/* 🔥 TAB HEADER */}
        <div className="mt-6 border-b border-slate-300 flex gap-8 text-sm font-semibold text-slate-700">
          
          <button
            onClick={() => setActiveTab('generate')}
            className={`pb-2 transition ${
              activeTab === 'generate'
                ? 'border-b-2 border-blue-600 text-blue-700 tracking-wide'
                : 'hover:text-slate-900'
            }`}
          >
            Generate Report
          </button>

          <button
            onClick={() => setActiveTab('ask')}
            className={`pb-2 transition ${
              activeTab === 'ask'
                ? 'border-b-2 border-blue-600 text-blue-700 tracking-wide'
                : 'hover:text-slate-900'
            }`}
          >
            Ask Questions
          </button>
        </div>

        {/* CONTENT */}
        <div className="mt-6 space-y-6">

          {activeTab === 'generate' && (
            <>
              <Upload onUpload={handleFileUpload} />

              <button
                onClick={handleGenerateReport}
                className="w-full rounded-xl bg-blue-600 py-3 text-white font-semibold tracking-wider hover:bg-blue-700 transition"
              >
                Generate Final Report
              </button>

              {report && <ReportView report={report} />}
            </>
          )}

          {activeTab === 'ask' && (
            <>
              <QueryPanel onQuery={handleQuery} disabled={!report} />
              <ResponsePanel responses={messages} />
              <SourceDisplay source={source} />
            </>
          )}

        </div>
      </div>
    </div>
  );
}