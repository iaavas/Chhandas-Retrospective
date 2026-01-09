import React from "react";
import {
  detectSyllables,
  splitAksharas,
  type SYLLABLE,
} from "./utils/chhandas";
import { GANAS } from "./utils/constant";
import SEO, { pageSEO } from "./components/SEO";

function SyllableCounter() {
  const [input, setInput] = React.useState("");
  const [analysis, setAnalysis] = React.useState<{
    aksharas: string[];
    syllables: SYLLABLE[];
    ganaSeq: string[];
    statistics: {
      totalAksharas: number;
      totalSyllables: number;
      guruCount: number;
      laghuCount: number;
      guruPercentage: number;
      laghuPercentage: number;
      totalGanas: number;
    };
  } | null>(null);

  const analyzeText = () => {
    if (!input.trim()) return;

    const aksharas = splitAksharas(input);
    const syllables = detectSyllables(input);
    const ganaSeq = toGanas(syllables);

    const guruCount = syllables.filter((s) => s === "S").length;
    const laghuCount = syllables.filter((s) => s === "I").length;

    setAnalysis({
      aksharas,
      syllables,
      ganaSeq,
      statistics: {
        totalAksharas: aksharas.length,
        totalSyllables: syllables.length,
        guruCount,
        laghuCount,
        guruPercentage:
          syllables.length > 0 ? (guruCount / syllables.length) * 100 : 0,
        laghuPercentage:
          syllables.length > 0 ? (laghuCount / syllables.length) * 100 : 0,
        totalGanas: ganaSeq.length,
      },
    });
  };

  const toGanas = (seq: SYLLABLE[]): string[] => {
    const result: string[] = [];
    for (let i = 0; i < seq.length; i += 3) {
      const chunk = seq.slice(i, i + 3).join("");
      if (chunk.length > 0) result.push(chunk);
    }
    return result;
  };

  const exportAnalysis = () => {
    if (!analysis) return;

    const data = {
      input: input,
      analysis: analysis,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "syllable-analysis.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyAnalysis = () => {
    if (!analysis) return;

    const text = `Syllable Analysis:
Total Aksharas: ${analysis.statistics.totalAksharas}
Total Syllables: ${analysis.statistics.totalSyllables}
Guru (S): ${
      analysis.statistics.guruCount
    } (${analysis.statistics.guruPercentage.toFixed(1)}%)
Laghu (I): ${
      analysis.statistics.laghuCount
    } (${analysis.statistics.laghuPercentage.toFixed(1)}%)
Total Ganas: ${analysis.statistics.totalGanas}

Syllable Pattern: ${analysis.syllables.join(" ")}
Gana Pattern: ${analysis.ganaSeq.join(" ")}`;

    navigator.clipboard.writeText(text);
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-24">
      <SEO {...pageSEO.syllableCounter} />
      <div className="container max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-3 tracking-tight">
            अक्षर र मात्रा विश्लेषक
          </h1>
          <p className="text-slate-500 text-lg font-light">
            नेपाली पाठको अक्षर र मात्रा विश्लेषण गर्नुहोस्
          </p>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto mt-6"></div>
        </div>

        {/* Input Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-8 mb-8">
          <div className="space-y-6">
            <div className="relative">
              <label className="block text-slate-700 font-medium mb-3">
                विश्लेषण गर्नका लागि पाठ लेख्नुहोस्:
              </label>
              <textarea
                className="w-full p-6 bg-slate-50/50 border-0 rounded-xl text-slate-700 placeholder-slate-400 text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-slate-300/50 focus:bg-white/80 transition-all duration-200 resize-none"
                rows={6}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="यहाँ आफ्नो नेपाली पाठ लेख्नुहोस्..."
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={analyzeText}
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

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Statistics Overview */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-800">
                  विश्लेषण परिणाम
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={copyAnalysis}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all duration-200"
                  >
                    कपी गर्नुहोस्
                  </button>
                  <button
                    onClick={exportAnalysis}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
                  >
                    निर्यात गर्नुहोस्
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-50/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-slate-800">
                    {analysis.statistics.totalAksharas}
                  </div>
                  <div className="text-sm text-slate-600">कुल अक्षर</div>
                </div>
                <div className="bg-slate-50/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-slate-800">
                    {analysis.statistics.totalSyllables}
                  </div>
                  <div className="text-sm text-slate-600">कुल मात्रा</div>
                </div>
                <div className="bg-slate-50/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {analysis.statistics.guruCount}
                  </div>
                  <div className="text-sm text-slate-600">गुरु</div>
                </div>
                <div className="bg-slate-50/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {analysis.statistics.laghuCount}
                  </div>
                  <div className="text-sm text-slate-600">लघु</div>
                </div>
              </div>

              {/* Percentage Bars */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-slate-600 mb-2">
                    <span>गुरु मात्रा</span>
                    <span>
                      {analysis.statistics.guruPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${analysis.statistics.guruPercentage}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-slate-600 mb-2">
                    <span>लघु मात्रा</span>
                    <span>
                      {analysis.statistics.laghuPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${analysis.statistics.laghuPercentage}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Analysis Table */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-6">
                विस्तृत विश्लेषण
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <tbody>
                    {/* Aksharas Row */}
                    <tr>
                      <td className="text-slate-500 text-sm font-medium py-2 pr-4 border-r border-slate-200 w-20">
                        अक्षर
                      </td>
                      {analysis.aksharas.map((akshara, i) => (
                        <td
                          key={i}
                          className="px-2 py-2 text-center font-medium text-slate-800 border-r border-slate-100 last:border-r-0 min-w-[2rem]"
                        >
                          {akshara}
                        </td>
                      ))}
                    </tr>

                    {/* Syllable Type Row */}
                    <tr className="bg-slate-50/50">
                      <td className="text-slate-500 text-sm font-medium py-2 pr-4 border-r border-slate-200">
                        मात्रा
                      </td>
                      {analysis.syllables.map((syllable, i) => (
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
                      {analysis.syllables.map((_, i) => {
                        const ganaIndex = Math.floor(i / 3);
                        const positionInGana = i % 3;
                        const gana = analysis.ganaSeq[ganaIndex];

                        const showGanaName = positionInGana === 1 && gana;

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

            {/* Gana Summary */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-6">
                गण सारांश
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-slate-600 font-medium mb-2">
                    गण प्याटर्न:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.ganaSeq.map((gana, i) => (
                      <span
                        key={i}
                        className="px-3 py-2 bg-purple-100 text-purple-800 rounded-lg font-medium border border-purple-200"
                      >
                        {GANAS[gana] || gana}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-slate-600 font-medium mb-2">
                    गण कोडहरू:
                  </h4>
                  <div className="p-4 bg-slate-50 rounded-lg font-mono text-slate-800">
                    {analysis.ganaSeq.join(" ")}
                  </div>
                </div>

                <div>
                  <h4 className="text-slate-600 font-medium mb-2">
                    मात्रा प्याटर्न:
                  </h4>
                  <div className="p-4 bg-slate-50 rounded-lg font-mono text-slate-800">
                    {analysis.syllables.join(" ")}
                  </div>
                </div>
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

export default SyllableCounter;
