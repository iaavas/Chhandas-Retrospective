import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import About from "./About";
import { processStanza, splitAksharas } from "./utils/chhandas";
import { GANAS, type SYLLABLE } from "./utils/constant";

function Home() {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState<{
    results: Array<{
      line: string;
      syllables: SYLLABLE[];
      ganaSeq: string[];
      chhanda: string | null;
    }>;
    overallChhanda: string | null;
  } | null>(null);

  const handleCheck = () => {
    const result = processStanza(input);
    setOutput(result);
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-24">
      <div className="container max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-3 tracking-tight">
            छन्द Retrospective
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
                rows={6}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="यहाँ आफ्नो कविता वा श्लोक लेख्नुहोस्... (प्रत्येक हरफ नयाँ लाइनमा)"
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
            {/* Main Chhanda Result - FIRST */}
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl border border-emerald-200/50 shadow-lg p-8 text-center">
              <div className="space-y-4">
                <div className="flex justify-center items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      output.overallChhanda ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  ></div>
                  <h2 className="text-slate-700 font-semibold text-2xl">
                    पहिचान गरिएको छन्द
                  </h2>
                </div>

                {output.overallChhanda ? (
                  <div className="inline-block px-8 py-4 bg-emerald-100 border-2 border-emerald-300 rounded-2xl shadow-sm">
                    <span className="text-emerald-900 font-bold text-3xl">
                      {output.overallChhanda}
                    </span>
                  </div>
                ) : (
                  <div className="inline-block px-8 py-4 bg-amber-100 border-2 border-amber-300 rounded-2xl shadow-sm">
                    <span className="text-amber-900 font-semibold text-xl">
                      एकरूप छन्द फेला परेन
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Line by Line Analysis */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                <h3 className="text-slate-700 font-semibold text-xl">
                  हरफ अनुसार विश्लेषण
                </h3>
              </div>

              <div className="space-y-8">
                {output.results.map((result, lineIndex) => (
                  <div
                    key={lineIndex}
                    className="border-l-4 border-indigo-200 pl-6 space-y-4"
                  >
                    {/* Line Text */}
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <h4 className="text-indigo-800 font-medium text-lg mb-2">
                        हरफ {lineIndex + 1}:
                      </h4>
                      <p className="text-indigo-900 text-xl font-medium">
                        {result.line}
                      </p>
                      {result.chhanda && (
                        <div className="mt-2">
                          <span className="inline-block px-3 py-1 bg-indigo-200 text-indigo-800 rounded-full text-sm font-medium">
                            {result.chhanda}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Syllables for this line */}
                    <div>
                      <h5 className="text-slate-600 font-medium mb-2">
                        अक्षरहरू:
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {splitAksharas(result.line).map((syllable, i) => (
                          <span
                            key={i}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                              result.syllables[i] === "S"
                                ? "bg-red-50 text-red-800 border-red-200"
                                : "bg-blue-50 text-blue-800 border-blue-200"
                            }`}
                          >
                            {syllable} (
                            {result.syllables[i] === "S" ? "गुरु" : "लघु"})
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Ganas for this line */}
                    <div>
                      <h5 className="text-slate-600 font-medium mb-2">
                        गणहरू:
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {result.ganaSeq.map((g, i) => (
                          <span
                            key={i}
                            className="px-4 py-2 bg-purple-50 text-purple-800 rounded-xl font-mono text-sm border border-purple-200/50 shadow-sm"
                          >
                            {GANAS[g] || g}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <footer className="text-center mt-12">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto mt-6"></div>
          <p className="text-lg font-light text-slate-800 mb-3 mt-6">
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
