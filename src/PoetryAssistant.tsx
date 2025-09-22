import React from "react";
import { processStanza } from "./utils/chhandas";
import { GANAS, CHHANDAS, type SYLLABLE } from "./utils/constant";

function PoetryAssistant() {
  const [input, setInput] = React.useState("");
  const [selectedChhanda, setSelectedChhanda] = React.useState("");
  const [realTimeAnalysis, setRealTimeAnalysis] = React.useState<{
    results: Array<{
      line: string;
      syllables: SYLLABLE[];
      ganaSeq: string[];
      chhanda: string | null;
      isCorrect: boolean;
      matchPercentage: number;
    }>;
    overallChhanda: string | null;
    suggestions: string[];
  } | null>(null);
  const [showSuggestions, setShowSuggestions] = React.useState(true);
  const [autoAnalyze, setAutoAnalyze] = React.useState(true);

  const analyzeText = React.useCallback(
    (text: string) => {
      if (!text.trim()) {
        setRealTimeAnalysis(null);
        return;
      }

      const lines = text
        .trim()
        .split("\n")
        .filter((line) => line.trim());
      const results = lines.map((line) => {
        const analysis = processStanza(line);
        const result = analysis.results[0];
        const ganaSeq = result.ganaSeq;

        let isCorrect = false;
        let matchPercentage = 0;

        if (selectedChhanda && CHHANDAS[selectedChhanda]) {
          const expectedPattern = CHHANDAS[selectedChhanda];
          const actualPattern = ganaSeq;
          isCorrect = actualPattern.join("") === expectedPattern.join("");

          // Calculate match percentage
          const maxLength = Math.max(
            actualPattern.length,
            expectedPattern.length
          );
          let matches = 0;
          for (let i = 0; i < maxLength; i++) {
            if (actualPattern[i] === expectedPattern[i]) {
              matches++;
            }
          }
          matchPercentage = maxLength > 0 ? (matches / maxLength) * 100 : 0;
        }

        return {
          ...result,
          isCorrect,
          matchPercentage,
        };
      });

      const chhandas = results.map((r) => r.chhanda).filter(Boolean);
      const overallChhanda =
        chhandas.length > 0 && chhandas.every((c) => c === chhandas[0])
          ? chhandas[0]
          : null;

      // Generate suggestions
      const suggestions = generateSuggestions(results, selectedChhanda);

      setRealTimeAnalysis({
        results,
        overallChhanda,
        suggestions,
      });
    },
    [selectedChhanda]
  );

  const generateSuggestions = (
    results: any[],
    targetChhanda: string
  ): string[] => {
    const suggestions: string[] = [];

    if (!targetChhanda || !CHHANDAS[targetChhanda]) {
      return suggestions;
    }

    const expectedPattern = CHHANDAS[targetChhanda];

    results.forEach((result, lineIndex) => {
      if (result.matchPercentage < 100) {
        const actualPattern = result.ganaSeq;
        const maxLength = Math.max(
          actualPattern.length,
          expectedPattern.length
        );

        for (let i = 0; i < maxLength; i++) {
          const actual = actualPattern[i] || "";
          const expected = expectedPattern[i] || "";

          if (actual !== expected) {
            if (expected) {
              suggestions.push(
                `हरफ ${lineIndex + 1}, गण ${
                  i + 1
                }: "${actual}" को सट्टामा "${expected}" (${
                  GANAS[expected] || expected
                }) प्रयोग गर्नुहोस्`
              );
            } else {
              suggestions.push(
                `हरफ ${lineIndex + 1}, गण ${
                  i + 1
                }: अतिरिक्त गण "${actual}" हटाउनुहोस्`
              );
            }
          }
        }
      }
    });

    return suggestions.slice(0, 5); // Limit to 5 suggestions
  };

  React.useEffect(() => {
    if (autoAnalyze) {
      const timeoutId = setTimeout(() => {
        analyzeText(input);
      }, 500); // Debounce analysis

      return () => clearTimeout(timeoutId);
    }
  }, [input, analyzeText, autoAnalyze]);

  const handleManualAnalyze = () => {
    analyzeText(input);
  };

  const getLineStatusColor = (result: any) => {
    if (!selectedChhanda) {
      return result.chhanda
        ? "border-green-300 bg-green-50/30"
        : "border-slate-300";
    }

    if (result.isCorrect) return "border-green-300 bg-green-50/30";
    if (result.matchPercentage >= 70)
      return "border-yellow-300 bg-yellow-50/30";
    return "border-red-300 bg-red-50/30";
  };

  const getLineStatusText = (result: any) => {
    if (!selectedChhanda) {
      return result.chhanda ? "छन्द पहिचान भयो" : "छन्द पहिचान भएन";
    }

    if (result.isCorrect) return "सही छन्द";
    if (result.matchPercentage >= 70) return "लगभग सही";
    return "छन्द मिलेन";
  };

  const getLineStatusIcon = (result: any) => {
    if (!selectedChhanda) {
      return result.chhanda ? "✓" : "?";
    }

    if (result.isCorrect) return "✓";
    if (result.matchPercentage >= 70) return "~";
    return "✗";
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-24">
      <div className="container max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-3 tracking-tight">
            कविता लेख्ने सहायक
          </h1>
          <p className="text-slate-500 text-lg font-light">
            रियल-टाइम छन्द विश्लेषणका साथ कविता लेख्नुहोस्
          </p>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input and Analysis */}
          <div className="space-y-6">
            {/* Target Chhanda Selection */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-800">
                    लक्ष्य छन्द
                  </h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="autoAnalyze"
                      checked={autoAnalyze}
                      onChange={(e) => setAutoAnalyze(e.target.checked)}
                      className="w-4 h-4 text-slate-600 bg-slate-100 border-slate-300 rounded focus:ring-slate-500"
                    />
                    <label
                      htmlFor="autoAnalyze"
                      className="text-sm text-slate-600"
                    >
                      स्वचालित विश्लेषण
                    </label>
                  </div>
                </div>

                <select
                  value={selectedChhanda}
                  onChange={(e) => setSelectedChhanda(e.target.value)}
                  className="w-full p-3 bg-slate-50/50 border-0 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300/50 focus:bg-white/80 transition-all duration-200"
                >
                  <option value="">छन्द छान्नुहोस् (वैकल्पिक)</option>
                  {Object.keys(CHHANDAS).map((chhanda) => (
                    <option key={chhanda} value={chhanda}>
                      {chhanda}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Text Input */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-800">
                    कविता लेख्नुहोस्
                  </h3>
                  {!autoAnalyze && (
                    <button
                      onClick={handleManualAnalyze}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800 transition-all duration-200"
                    >
                      विश्लेषण गर्नुहोस्
                    </button>
                  )}
                </div>

                <textarea
                  className="w-full p-4 bg-slate-50/50 border-0 rounded-xl text-slate-700 placeholder-slate-400 text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-slate-300/50 focus:bg-white/80 transition-all duration-200 resize-none"
                  rows={12}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="यहाँ आफ्नो कविता लेख्नुहोस्... (प्रत्येक हरफ नयाँ लाइनमा)"
                />
              </div>
            </div>

            {/* Overall Analysis */}
            {realTimeAnalysis && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  समग्र विश्लेषण
                </h3>

                {realTimeAnalysis.overallChhanda && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-800">
                        छन्द: {realTimeAnalysis.overallChhanda}
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-50/50 rounded-lg p-3">
                    <div className="text-slate-600 mb-1">कुल हरफ</div>
                    <div className="font-semibold text-slate-800">
                      {realTimeAnalysis.results.length}
                    </div>
                  </div>
                  <div className="bg-slate-50/50 rounded-lg p-3">
                    <div className="text-slate-600 mb-1">सही हरफ</div>
                    <div className="font-semibold text-slate-800">
                      {
                        realTimeAnalysis.results.filter((r) => r.isCorrect)
                          .length
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Real-time Analysis */}
          <div className="space-y-6">
            {/* Line by Line Analysis */}
            {realTimeAnalysis && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">
                    हरफ अनुसार विश्लेषण
                  </h3>
                  <span className="text-sm text-slate-500">
                    {realTimeAnalysis.results.length} हरफ
                  </span>
                </div>

                <div className="space-y-3">
                  {realTimeAnalysis.results.map((result, lineIndex) => (
                    <div
                      key={lineIndex}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${getLineStatusColor(
                        result
                      )}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">
                            {getLineStatusIcon(result)}
                          </span>
                          <span className="font-medium text-slate-700">
                            हरफ {lineIndex + 1}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-slate-600">
                            {getLineStatusText(result)}
                          </div>
                          {selectedChhanda && (
                            <div className="text-xs text-slate-500">
                              {result.matchPercentage.toFixed(1)}% मिलान
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-slate-800 mb-2">{result.line}</div>

                      <div className="flex flex-wrap gap-1">
                        {result.ganaSeq.map((gana, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium"
                          >
                            {GANAS[gana] || gana}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {realTimeAnalysis &&
              realTimeAnalysis.suggestions.length > 0 &&
              showSuggestions && (
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">
                      सुझावहरू
                    </h3>
                    <button
                      onClick={() => setShowSuggestions(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-2">
                    {realTimeAnalysis.suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-slate-700"
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Quick Reference */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                गण सन्दर्भ
              </h3>

              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(GANAS).map(([code, name]) => (
                  <div
                    key={code}
                    className="flex justify-between items-center p-2 bg-slate-50 rounded"
                  >
                    <span className="font-mono text-slate-600">{code}</span>
                    <span className="text-slate-700">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

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

export default PoetryAssistant;
