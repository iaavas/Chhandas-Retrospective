import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import About from "./About";
import { detectSyllables, toGanas, detectChhanda } from "./utils/chhandas";
import { GANAS } from "./utils/constant";

function Home() {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState<{
    syllables: string[];
    ganaSeq: string[];
    chhanda: string | null;
  } | null>(null);

  const handleCheck = () => {
    const syllables = detectSyllables(input);
    const ganaSeq = toGanas(syllables);
    const chhanda = detectChhanda(ganaSeq);
    setOutput({ syllables, ganaSeq, chhanda });
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-24">
      <div className="container max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-3 tracking-tight">
            श्लोक Retrospective
          </h1>
          <p className="text-slate-500 text-lg font-light">
            Nepali Chhanda Checker
          </p>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto mt-6"></div>
        </div>

        {/* Input Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-8 mb-8">
          <div className="space-y-6">
            <div className="relative">
              <textarea
                className="w-full p-6 bg-slate-50/50 border-0 rounded-xl text-slate-700 placeholder-slate-400 text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-slate-300/50 focus:bg-white/80 transition-all duration-200 resize-none"
                rows={5}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="यहाँ आफ्नो कविता लेख्नुहोस्..."
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleCheck}
                disabled={!input.trim()}
                className={`
    px-8 py-3 rounded-xl font-medium text-base
    transition-all duration-200
    ${
      !input.trim()
        ? "bg-slate-300 text-slate-500 cursor-not-allowed"
        : "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg shadow-slate-900/25"
    }
  `}
              >
                विश्लेषण गर्नुहोस्
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {output && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Syllables */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <h3 className="text-slate-700 font-medium">अक्षरहरू</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {output.syllables.map((syllable, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1.5 bg-blue-50 text-blue-800 rounded-lg text-sm font-medium border border-blue-200/50${
                      i % 3 === 0 ? " ml-6" : ""
                    }`}
                  >
                    {syllable}
                  </span>
                ))}
              </div>
            </div>

            {/* Ganas */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <h3 className="text-slate-700 font-medium">गणहरू</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {output.ganaSeq.map((g, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-purple-50 text-purple-800 rounded-xl font-mono text-sm border border-purple-200/50 shadow-sm"
                  >
                    {GANAS[g] || g}
                  </span>
                ))}
              </div>
            </div>

            {/* Chhanda Result */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg p-8 text-center">
              <div className="space-y-3">
                <div className="flex justify-center items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      output.chhanda ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  ></div>
                  <h3 className="text-slate-700 font-medium text-lg">
                    पहिचान गरिएको छन्द
                  </h3>
                </div>

                {output.chhanda ? (
                  <div className="inline-block px-6 py-3 bg-emerald-50 border border-emerald-200/50 rounded-full">
                    <span className="text-emerald-800 font-semibold text-xl">
                      {output.chhanda}
                    </span>
                  </div>
                ) : (
                  <div className="inline-block px-6 py-3 bg-amber-50 border border-amber-200/50 rounded-full">
                    <span className="text-amber-800 font-medium">
                      कुनै मिल्दो छन्द फेला परेन
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <footer className="text-center mt-12">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto mt-6"></div>

          <p className="text-lg font-light text-slate-800 mb-3  mt-6">
            Designed by{" "}
            <a
              href="https://www.linkedin.com/in/aavashbaral/"
              className="text-black tracking-tight decoration-1 decoration-black/40 underline underline-offset-4"
              style={{
                textUnderlineOffset: 4,
                color: "#1e293b",
                textDecoration: "underline",
              }}
            >
              आभाष बराल
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}
