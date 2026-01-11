import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Navbar from "./Navbar";
import About from "./About";
import TestChhanda from "./TestChhanda";
import SEO, { pageSEO } from "./components/SEO";
import { processStanza, type AnustubhResult } from "./utils/chhandas";
import { GANAS, type SYLLABLE } from "./utils/constant";
import { useLanguage } from "./contexts/LanguageContext";
import Footer from "./components/Footer";

function Home() {
  const { t } = useLanguage();
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState<{
    results: Array<{
      line: string;
      syllables: SYLLABLE[];
      aksharas: string[];
      aksharaToSyllableMap: (number | null)[];
      ganaSeq: string[];
      chhanda: string | null;
    }>;
    overallChhanda: string | null;
    anustubhResult: AnustubhResult | null;
  } | null>(null);
  const resultRef = React.useRef<HTMLDivElement>(null);

  const handleCheck = () => {
    const result = processStanza(input);
    setOutput(result);
    // Scroll to results after a brief delay
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleClear = () => {
    setInput("");
    setOutput(null);
  };

  // Keyboard shortcut: Cmd/Ctrl + Enter to analyze
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && input.trim()) {
      handleCheck();
    }
  };

  // Determine the detected chhanda (prioritize Anustubh if detected)
  const detectedChhanda = output?.anustubhResult?.isAnustubh
    ? "अनुष्टुप्"
    : output?.overallChhanda;

  // Count lines and syllables
  const lineCount = input.trim()
    ? input
        .trim()
        .split("\n")
        .filter((l) => l.trim()).length
    : 0;
  const totalSyllables =
    output?.results.reduce((sum, r) => sum + r.syllables.length, 0) || 0;

  return (
    <main className="min-h-screen w-full bg-white pt-20">
      <SEO {...pageSEO.home} />
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-normal text-slate-900 mb-2">
            {t("home.title")}
          </h1>
          <p className="text-slate-500">{t("home.subtitle")}</p>
        </div>

        {/* Input Section */}
        <div className="mb-8">
          <div className="relative">
            <textarea
              className="w-full p-4 border border-slate-200 rounded text-slate-800 placeholder-slate-400 text-lg leading-relaxed focus:outline-none focus:border-slate-400 resize-none"
              rows={5}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("home.placeholder")}
            />
            {input && (
              <button
                onClick={handleClear}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1"
                title="Clear"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Input stats and actions */}
          <div className="flex items-center justify-between mt-3">
            <div className="text-xs text-slate-400">
              {lineCount > 0 && (
                <span>
                  {lineCount} {lineCount === 1 ? "line" : "lines"}
                </span>
              )}
              {lineCount === 0 && (
                <span className="text-slate-300">⌘+Enter to analyze</span>
              )}
            </div>
            <button
              onClick={handleCheck}
              disabled={!input.trim()}
              className={`px-5 py-2 rounded text-sm font-medium transition-colors ${
                !input.trim()
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {t("common.analyze")}
            </button>
          </div>
        </div>

        {/* Detected Chhanda */}
        {detectedChhanda && (
          <div
            ref={resultRef}
            className="mb-10 py-8 text-center bg-slate-50 -mx-4 px-4"
          >
            <span className="text-xs text-slate-400 uppercase tracking-wider block mb-2">
              छन्द
            </span>
            <span className="text-slate-900 text-4xl">{detectedChhanda}</span>
            {output?.anustubhResult?.isAnustubh && (
              <span className="block text-sm text-slate-400 mt-2">
                {output.anustubhResult.confidence}%
              </span>
            )}
            <div className="mt-4 text-xs text-slate-400">
              {totalSyllables} अक्षर • {output?.results.length} पंक्ति
            </div>
          </div>
        )}

        {/* No chhanda detected */}
        {output && !detectedChhanda && (
          <div
            ref={resultRef}
            className="mb-10 py-6 text-center text-slate-500 bg-slate-50 -mx-4 px-4"
          >
            <span className="text-sm">कुनै छन्द पहिचान भएन</span>
            <div className="mt-2 text-xs text-slate-400">
              {totalSyllables} अक्षर • {output?.results.length} पंक्ति
            </div>
          </div>
        )}

        {/* Results Section */}
        {output && (
          <div className="space-y-8">
            <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">
              {t("home.lineAnalysis")}
            </h3>

            <div className="space-y-10">
              {output.results.map((result, lineIndex) => (
                <div key={lineIndex} className="space-y-4">
                  {/* Line Text */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-sm text-slate-500">
                        {t("common.line")} {lineIndex + 1}
                      </span>
                      <p className="text-slate-900 text-xl mt-1">
                        {result.line}
                      </p>
                    </div>
                    {result.chhanda && (
                      <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">
                        {result.chhanda}
                      </span>
                    )}
                  </div>

                  {/* Tabular Analysis */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <tbody>
                        {/* Aksharas Row */}
                        <tr className="border-b border-slate-100">
                          <td className="text-slate-500 py-2 pr-4 w-20">
                            {t("home.akshara")}
                          </td>
                          {result.aksharas.map((akshara, i) => (
                            <td
                              key={i}
                              className="px-2 py-2 text-center text-slate-800"
                            >
                              {akshara}
                            </td>
                          ))}
                        </tr>

                        {/* Syllable Type Row */}
                        <tr className="border-b border-slate-100">
                          <td className="text-slate-500 py-2 pr-4">
                            {t("common.matra")}
                          </td>
                          {result.aksharas.map((_, i) => {
                            const syllableIndex =
                              result.aksharaToSyllableMap[i];
                            if (syllableIndex === null) {
                              return (
                                <td
                                  key={i}
                                  className="px-2 py-2 text-center text-xs text-slate-400"
                                  title="यो अक्षर अघिल्लो मात्रा बन्द गर्छ"
                                >
                                  —
                                </td>
                              );
                            }
                            const syllable = result.syllables[syllableIndex];
                            return (
                              <td
                                key={i}
                                className={`px-2 py-2 text-center ${
                                  syllable === "S"
                                    ? "text-red-600"
                                    : "text-blue-600"
                                }`}
                              >
                                {syllable === "S"
                                  ? t("common.guru")
                                  : t("common.laghu")}
                              </td>
                            );
                          })}
                        </tr>

                        {/* Gana Pattern Row */}
                        <tr>
                          <td className="text-slate-500 py-2 pr-4">
                            {t("home.gana")}
                          </td>
                          {result.aksharas.map((_, i) => {
                            const syllableIndex =
                              result.aksharaToSyllableMap[i];
                            if (syllableIndex === null) {
                              return (
                                <td
                                  key={i}
                                  className="px-2 py-2 text-center"
                                ></td>
                              );
                            }

                            const ganaIndex = Math.floor(syllableIndex / 3);
                            const positionInGana = syllableIndex % 3;
                            const gana = result.ganaSeq[ganaIndex];
                            const showGanaName = positionInGana === 1 && gana;

                            return (
                              <td
                                key={i}
                                className={`px-2 py-2 text-center text-slate-700 ${
                                  positionInGana === 0
                                    ? "border-l border-slate-200"
                                    : ""
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
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/test" element={<TestChhanda />} />
        </Routes>
        <Footer />
      </Router>
    </LanguageProvider>
  );
}
