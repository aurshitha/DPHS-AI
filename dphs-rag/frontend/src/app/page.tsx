import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">

      {/* 🔥 HEADER (TOP) */}
      <header className="w-full px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="text-2xl font-semibold tracking-tight">DPHS-AI</div>

        <nav className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-full bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700 transition"
          >
            Dashboard
          </Link>

          <button className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10 transition">
            About
          </button>
        </nav>
      </header>

      {/* 🔥 CENTERED CONTENT */}
      <div className="flex flex-1 items-center justify-center px-6">

        <section className="grid gap-12 lg:grid-cols-2 items-center max-w-7xl w-full">

          {/* LEFT CARD */}
          <div className="space-y-8">

            <p className="text-sm uppercase tracking-[0.36em] text-cyan-300">
              Intelligent Medical Report Analysis
            </p>

            <h1 className="text-5xl font-semibold leading-tight sm:text-6xl">
              AI-Powered Medical Reports
              <br />
              Analyzed Instantly
            </h1>

            <p className="text-slate-300 max-w-xl">
              Upload medical reports and get intelligent, evidence-grounded
              clinical insights powered by RAG technology.
            </p>

            <div className="flex gap-4">
              <Link
                href="/dashboard"
                className="rounded-full bg-cyan-500 px-8 py-3 font-semibold text-slate-950 hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/30"
              >
                Start Analysis
              </Link>

              <Link
                href="/dashboard"
                className="rounded-full border border-white/20 px-8 py-3 hover:bg-white/10 transition"
              >
                Try Sample
              </Link>
            </div>
          </div>

          {/* 🔥 RIGHT CARD */}
          <div className="relative rounded-3xl bg-slate-900/80 p-8 border border-white/10 backdrop-blur-xl shadow-2xl">

            {/* Glow */}
            <div className="absolute inset-0 rounded-3xl bg-cyan-500/10 blur-2xl opacity-30 pointer-events-none"></div>

            <h3 className="text-lg font-semibold mb-6">
              How It Works
            </h3>

            <div className="space-y-6">
              {[
                { icon: '📁', title: 'Upload Report', desc: 'Upload CBC, Lipid, Biochemistry reports.' },
                { icon: '🧠', title: 'AI Analysis', desc: 'RAG model processes clinical data.' },
                { icon: '⚠️', title: 'Detect Abnormalities', desc: 'Highlights abnormal values.' },
                { icon: '💬', title: 'Ask Questions', desc: 'Interact with report insights.' },
              ].map((step, i) => (
                <div
                  key={i}
                  className="group flex items-start gap-4 p-3 rounded-xl transition hover:bg-white/5 hover:scale-[1.02]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500 text-xl text-slate-900 shadow-md shadow-cyan-500/30 group-hover:scale-110 transition">
                    {step.icon}
                  </div>

                  <div>
                    <p className="text-sm font-semibold group-hover:text-cyan-300 transition">
                      {step.title}
                    </p>
                    <p className="text-sm text-slate-400">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-cyan-300">
              Powered by RAG
            </div>

          </div>

        </section>
      </div>
    </main>
  );
}