import Link from 'next/link';

const Header: React.FC = () => (
  <header className="mb-6 rounded-3xl bg-gradient-to-r from-blue-400 to-indigo-600 p-8 text-white shadow">

    {/* 🔥 Animated Back Button */}
    <div className="mb-5">
      <Link
        href="/"
        className="group inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-base font-medium tracking-wide text-white backdrop-blur transition-all duration-300 hover:bg-white/20 hover:shadow-lg"
      >
        {/* Arrow */}
        <span className="transform transition-transform duration-300 group-hover:-translate-x-1">
          ←
        </span>

        {/* Text */}
        <span className="tracking-wider">
          Back to Home
        </span>
      </Link>
    </div>

    {/* HEADER CONTENT */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] opacity-80">
          Doctor Interface
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Medical Report Dashboard
        </h1>
      </div>

      <div className="text-sm opacity-90 tracking-wider">
        Upload → Analyze → Query Clinical Insights
      </div>
    </div>
  </header>
);

export default Header;