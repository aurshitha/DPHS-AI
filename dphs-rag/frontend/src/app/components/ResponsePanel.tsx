import { useState } from 'react';
import { QueryMessage } from '@/lib/types';

interface Props {
  responses: QueryMessage[];
}

const ResponsePanel: React.FC<Props> = ({ responses }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!responses.length) {
    return (
      <section className="bg-white p-6 rounded-3xl shadow">
        <h2 className="text-xl font-semibold">AI Analysis</h2>
        <p className="text-sm text-slate-500">No queries yet.</p>
      </section>
    );
  }

  return (
    <section className="bg-white p-6 rounded-3xl shadow space-y-3">
      <h2 className="text-xl font-semibold">AI Analysis</h2>

      {responses.map((msg, i) => (
        <div key={i} className="border rounded-xl border-slate-500 bg-[#F4F8F0]">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex justify-between p-3 font-semibold"
          >
            {msg.question}
            <span>{openIndex === i ? '▲' : '▼'}</span>
          </button>

          {openIndex === i && (
            <div className="p-3 text-sm text-slate-700">
              {msg.response.answer}
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

export default ResponsePanel;