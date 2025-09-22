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
      <div className="container max-w-6xl mx-auto px-6 py-16">
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
        <div className=" rounded-2xl  p-3 text-center my-4">
          {output?.overallChhanda ? (
            <div className="  rounded-2xl flex items-center gap-2 justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-slate-700 italic font-bold text-5xl ">
                {output?.overallChhanda}
              </span>
            </div>
          ) : (
            <div className="inline-block">
              <span>एकरूप छन्द फेला परेन</span>
            </div>
          )}
        </div>
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

            {/* Line by Line Analysis */}
            <div className="bg-white/70  rounded-2xl border border-slate-200/50  p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                <h3 className="text-slate-700 font-semibold text-xl">
                  हरफ अनुसार विश्लेषण
                </h3>
              </div>

              <div className="space-y-32">
                {output.results.map((result, lineIndex) => (
                  <div
                    key={lineIndex}
                    className="border-l-2  border-slate-200 pl-6 space-y-4"
                  >
                    {/* Line Text */}
                    <div className="bg-slate-50/10 rounded-lg p-4 flex justify-between">
                      <div>
                        <h4 className="text-slate-800 font-medium text-lg mb-2">
                          हरफ {lineIndex + 1}:
                        </h4>
                        <p className="text-slate-900 text-xl font-medium">
                          {result.line}
                        </p>
                      </div>
                      {result.chhanda && (
                        <div className="mt-2">
                          <span className="inline-block px-3 py-1 bg-slate-200 text-slate-800 rounded-full text-sm font-medium">
                            {result.chhanda}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Tabular Analysis */}
                    <div>
                      <h5 className="text-slate-600 font-medium mb-3">
                        विश्लेषण तालिका:
                      </h5>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <tbody>
                            {/* Aksharas Row */}
                            <tr>
                              <td className="text-slate-500 text-sm font-medium py-2 pr-4 border-r border-slate-200">
                                अक्षर
                              </td>
                              {splitAksharas(result.line).map((syllable, i) => (
                                <td
                                  key={i}
                                  className="px-2 py-2 text-center font-medium text-slate-800 border-r border-slate-100 last:border-r-0"
                                >
                                  {syllable}
                                </td>
                              ))}
                            </tr>

                            {/* Syllable Type Row */}
                            <tr className="bg-slate-50/50">
                              <td className="text-slate-500 text-sm font-medium py-2 pr-4 border-r border-slate-200">
                                मात्रा
                              </td>
                              {result.syllables.map((syllable, i) => (
                                <td
                                  key={i}
                                  className={`px-2 py-2 text-center text-sm font-medium border-r border-slate-100 last:border-r-0 ${
                                    syllable === "S"
                                      ? "text-red-700 bg-red-50/70"
                                      : "text-blue-700 bg-blue-50/70"
                                  }`}
                                >
                                  {syllable === "S" ? "गुरु" : "लघु"}
                                </td>
                              ))}
                            </tr>

                            {/* Gana Pattern Row */}
                            <tr>
                              <td className="text-slate-500 text-sm font-medium py-2 pr-4 border-r border-slate-200">
                                गण
                              </td>
                              {result.syllables.map((_, i) => {
                                const ganaIndex = Math.floor(i / 3);
                                const positionInGana = i % 3;
                                const gana = result.ganaSeq[ganaIndex];

                                // Only show gana name in the middle cell of each group
                                const showGanaName =
                                  positionInGana === 1 && gana;

                                return (
                                  <td
                                    key={i}
                                    className={`px-2 py-2 text-center text-sm font-medium border-r border-slate-100 last:border-r-0 ${
                                      positionInGana === 0
                                        ? "border-l-2 border-l-slate-300"
                                        : ""
                                    } ${
                                      ganaIndex % 2 === 0
                                        ? "bg-purple-50/50 text-purple-800"
                                        : "bg-indigo-50/50 text-indigo-800"
                                    }`}
                                  >
                                    {showGanaName ? GANAS[gana] || gana : ""}
                                  </td>
                                );
                              })}
                            </tr>
                          </tbody>
                        </table>
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
