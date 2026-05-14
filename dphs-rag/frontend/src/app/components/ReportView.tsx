import { Report } from '@/lib/types';

const ReportView = ({ report }: { report: Report }) => {
  return (
    <section className="border border-slate-300 bg-white p-6 rounded-3xl shadow space-y-6">

      {/* Key Findings */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800 tracking-wide">Key Findings</h2>
        <p className="mt-2 text-sm text-slate-700">{report.key_findings}</p>
      </div>

      {/* Lab Table */}
      <div>
        <h3 className="font-semibold text-slate-900 tracking-wide">Lab Values</h3>

        <div className="mt-3 max-h-90 overflow-y-auto border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-blue-900 text-white sticky top-0 z-10">
              <tr>
                <th className="p-2 text-left tracking-wide">Test</th>
                <th className="p-2 text-left tracking-wide">Value</th>
                <th className="p-2 text-left tracking-wide">Range</th>
              </tr>
            </thead>

            <tbody>
              {report.lab_values.map((lab, i) => (
                <tr
                  key={i}
                  className={`border-b ${
                    lab.abnormal
                      ? 'bg-red-50 text-red-700 font-medium'
                      : 'bg-white tracking-wide'
                  }`}
                >
                  <td className="p-2">{lab.name}</td>
                  <td className="p-2">{lab.value}</td>
                  <td className="p-2">{lab.normal_range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Abnormalities */}
      <div className="bg-red-50 p-4 rounded-xl">
        <h3 className="font-semibold text-red-700 tracking-wide">Abnormalities</h3>

        {/* 🔥 Scroll Container */}
        <div className="mt-3 max-h-60 overflow-y-auto pr-2">
          <ul className="list-disc pl-5 text-sm space-y-1 tracking-wide">
            {report.abnormalities.split('.').map((a, i) =>
              a.trim() ? <li key={i}>{a}</li> : null
            )}
          </ul>
        </div>
      </div>

      {/* 🔥 Interpretation (Scrollable) */}
      <div className="bg-slate-200 p-5 rounded-xl">
        <h3 className="font-semibold text-slate-900 tracking-wide">Interpretation</h3>

        {/* Scroll Container */}
        <div className="mt-3 max-h-72 overflow-y-auto pr-2">
          <div className="text-sm whitespace-pre-line leading-relaxed text-slate-700 tracking-wide">
            {report.interpretation}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportView;