interface SourceDisplayProps {
  source?: string;
}

const SourceDisplay: React.FC<SourceDisplayProps> = ({ source }) => {
  if (!source) return null;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
      <h2 className="text-xl font-semibold text-slate-900">Source</h2>
      <p className="mt-3 text-sm text-slate-600">{source}</p>
    </section>
  );
};

export default SourceDisplay;