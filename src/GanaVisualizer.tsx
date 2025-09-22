import React from "react";
import { processStanza, splitAksharas } from "./utils/chhandas";
import { GANAS, CHHANDAS, type SYLLABLE } from "./utils/constant";

function GanaVisualizer() {
  const [input, setInput] = React.useState("");
  const [selectedChhanda, setSelectedChhanda] = React.useState("");
  const [visualization, setVisualization] = React.useState<{
    results: Array<{
      line: string;
      syllables: SYLLABLE[];
      ganaSeq: string[];
      chhanda: string | null;
      isCorrect: boolean;
      matchPercentage: number;
    }>;
    overallChhanda: string | null;
  } | null>(null);
  const [viewMode, setViewMode] = React.useState<"gana" | "syllable" | "both">(
    "both"
  );
  const [colorScheme, setColorScheme] = React.useState<
    "default" | "rainbow" | "contrast"
  >("default");

  const analyzeText = () => {
    if (!input.trim()) {
      setVisualization(null);
      return;
    }

    const lines = input
      .trim()
      .split("\n")
      .filter((line) => line.trim());
    const results = lines.map((line) => {
      const analysis = processStanza(line);
      const result = analysis.results[0];
      const ganaSeq = result.ganaSeq;
      const chhanda = result.chhanda;

      let isCorrect = false;
      let matchPercentage = 0;

      if (selectedChhanda && CHHANDAS[selectedChhanda]) {
        const expectedPattern = CHHANDAS[selectedChhanda];
        const actualPattern = ganaSeq;
        isCorrect = actualPattern.join("") === expectedPattern.join("");

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

    setVisualization({
      results,
      overallChhanda,
    });
  };

  const getGanaColor = (gana: string, index: number) => {
    const ganaColors = {
      ISS: "bg-yellow-400",
      SSS: "bg-red-400",
      SSI: "bg-green-400",
      SIS: "bg-blue-400",
      ISI: "bg-purple-400",
      SII: "bg-pink-400",
      III: "bg-indigo-400",
      IIS: "bg-orange-400",
    };

    if (colorScheme === "rainbow") {
      const colors = [
        "bg-red-400",
        "bg-orange-400",
        "bg-yellow-400",
        "bg-green-400",
        "bg-blue-400",
        "bg-indigo-400",
        "bg-purple-400",
        "bg-pink-400",
      ];
      return colors[index % colors.length];
    }

    if (colorScheme === "contrast") {
      return index % 2 === 0 ? "bg-slate-600" : "bg-slate-800";
    }

    return ganaColors[gana as keyof typeof ganaColors] || "bg-gray-400";
  };

  const getSyllableColor = (syllable: SYLLABLE) => {
    if (colorScheme === "contrast") {
      return syllable === "S" ? "bg-red-600" : "bg-blue-600";
    }
    return syllable === "S" ? "bg-red-400" : "bg-blue-400";
  };

  const getGanaTextColor = (gana: string, index: number) => {
    if (colorScheme === "contrast") {
      return "text-white";
    }
    return "text-white";
  };

  const getSyllableTextColor = (syllable: SYLLABLE) => {
    if (colorScheme === "contrast") {
      return "text-white";
    }
    return "text-white";
  };

  const exportVisualization = () => {
    if (!visualization) return;

    const data = {
      input: input,
      selectedChhanda: selectedChhanda,
      visualization: visualization,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gana-visualization.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyVisualization = () => {
    if (!visualization) return;

    const text = visualization.results
      .map((result, index) => {
        const ganaPattern = result.ganaSeq.map((g) => GANAS[g] || g).join(" ");
        return `हरफ ${index + 1}: ${result.line}\nगण: ${ganaPattern}`;
      })
      .join("\n\n");

    navigator.clipboard.writeText(text);
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-24">
      <div className="container max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-3 tracking-tight">
            गण प्याटर्न भिजुअलाइजर
          </h1>
          <p className="text-slate-500 text-lg font-light">
            गण प्याटर्नहरूलाई रङ्गीन ब्लकहरूमा देखाउनुहोस्
          </p>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto mt-6"></div>
        </div>

        {/* Input Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-8 mb-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Text Input */}
              <div>
                <label className="block text-slate-700 font-medium mb-3">
                  कविता वा श्लोक लेख्नुहोस्:
                </label>
                <textarea
                  className="w-full p-4 bg-slate-50/50 border-0 rounded-xl text-slate-700 placeholder-slate-400 text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-slate-300/50 focus:bg-white/80 transition-all duration-200 resize-none"
                  rows={6}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="यहाँ आफ्नो कविता वा श्लोक लेख्नुहोस्... (प्रत्येक हरफ नयाँ लाइनमा)"
                />
              </div>

              {/* Controls */}
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-3">
                    लक्ष्य छन्द (वैकल्पिक):
                  </label>
                  <select
                    value={selectedChhanda}
                    onChange={(e) => setSelectedChhanda(e.target.value)}
                    className="w-full p-3 bg-slate-50/50 border-0 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300/50 focus:bg-white/80 transition-all duration-200"
                  >
                    <option value="">छन्द छान्नुहोस्...</option>
                    {Object.keys(CHHANDAS).map((chhanda) => (
                      <option key={chhanda} value={chhanda}>
                        {chhanda}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-3">
                    दृश्य मोड:
                  </label>
                  <select
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value as any)}
                    className="w-full p-3 bg-slate-50/50 border-0 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300/50 focus:bg-white/80 transition-all duration-200"
                  >
                    <option value="both">गण र मात्रा दुबै</option>
                    <option value="gana">गण मात्र</option>
                    <option value="syllable">मात्रा मात्र</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-3">
                    रङ्ग योजना:
                  </label>
                  <select
                    value={colorScheme}
                    onChange={(e) => setColorScheme(e.target.value as any)}
                    className="w-full p-3 bg-slate-50/50 border-0 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300/50 focus:bg-white/80 transition-all duration-200"
                  >
                    <option value="default">पूर्वनिर्धारित</option>
                    <option value="rainbow">इन्द्रधनुष</option>
                    <option value="contrast">उच्च कन्ट्रास्ट</option>
                  </select>
                </div>
              </div>
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
                भिजुअलाइज गर्नुहोस्
              </button>
            </div>
          </div>
        </div>

        {/* Visualization Results */}
        {visualization && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Overall Analysis */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-800">
                  समग्र विश्लेषण
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={copyVisualization}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all duration-200"
                  >
                    कपी गर्नुहोस्
                  </button>
                  <button
                    onClick={exportVisualization}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
                  >
                    निर्यात गर्नुहोस्
                  </button>
                </div>
              </div>

              {visualization.overallChhanda && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-green-800">
                      छन्द: {visualization.overallChhanda}
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-slate-50/50 rounded-lg p-3">
                  <div className="text-slate-600 mb-1">कुल हरफ</div>
                  <div className="font-semibold text-slate-800">
                    {visualization.results.length}
                  </div>
                </div>
                <div className="bg-slate-50/50 rounded-lg p-3">
                  <div className="text-slate-600 mb-1">सही हरफ</div>
                  <div className="font-semibold text-slate-800">
                    {visualization.results.filter((r) => r.isCorrect).length}
                  </div>
                </div>
                <div className="bg-slate-50/50 rounded-lg p-3">
                  <div className="text-slate-600 mb-1">औसत मिलान</div>
                  <div className="font-semibold text-slate-800">
                    {selectedChhanda
                      ? (
                          visualization.results.reduce(
                            (sum, r) => sum + r.matchPercentage,
                            0
                          ) / visualization.results.length
                        ).toFixed(1) + "%"
                      : "N/A"}
                  </div>
                </div>
                <div className="bg-slate-50/50 rounded-lg p-3">
                  <div className="text-slate-600 mb-1">कुल गण</div>
                  <div className="font-semibold text-slate-800">
                    {visualization.results.reduce(
                      (sum, r) => sum + r.ganaSeq.length,
                      0
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Patterns */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-6">
                दृश्य प्याटर्नहरू
              </h3>

              <div className="space-y-8">
                {visualization.results.map((result, lineIndex) => (
                  <div key={lineIndex} className="space-y-4">
                    {/* Line Header */}
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-slate-700">
                        हरफ {lineIndex + 1}
                      </h4>
                      <div className="flex items-center gap-3">
                        {selectedChhanda && (
                          <div className="text-sm text-slate-600">
                            {result.matchPercentage.toFixed(1)}% मिलान
                          </div>
                        )}
                        <div
                          className={`w-3 h-3 rounded-full ${
                            result.isCorrect
                              ? "bg-green-500"
                              : result.matchPercentage >= 70
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                      </div>
                    </div>

                    {/* Line Text */}
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="text-slate-800 text-lg font-medium">
                        {result.line}
                      </div>
                    </div>

                    {/* Gana Visualization */}
                    {(viewMode === "gana" || viewMode === "both") && (
                      <div>
                        <h5 className="text-slate-600 font-medium mb-3">
                          गण प्याटर्न:
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {result.ganaSeq.map((gana, ganaIndex) => (
                            <div
                              key={ganaIndex}
                              className={`px-4 py-3 rounded-lg font-medium text-center min-w-[80px] ${getGanaColor(
                                gana,
                                ganaIndex
                              )} ${getGanaTextColor(gana, ganaIndex)}`}
                            >
                              <div className="text-sm font-bold">
                                {GANAS[gana] || gana}
                              </div>
                              <div className="text-xs opacity-80">{gana}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Syllable Visualization */}
                    {(viewMode === "syllable" || viewMode === "both") && (
                      <div>
                        <h5 className="text-slate-600 font-medium mb-3">
                          मात्रा प्याटर्न:
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {result.syllables.map((syllable, syllableIndex) => (
                            <div
                              key={syllableIndex}
                              className={`px-3 py-2 rounded font-medium text-center min-w-[40px] ${getSyllableColor(
                                syllable
                              )} ${getSyllableTextColor(syllable)}`}
                            >
                              <div className="text-sm font-bold">
                                {syllable === "S" ? "गुरु" : "लघु"}
                              </div>
                              <div className="text-xs opacity-80">
                                {syllable}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Combined Visualization */}
                    {viewMode === "both" && (
                      <div>
                        <h5 className="text-slate-600 font-medium mb-3">
                          संयुक्त दृश्य:
                        </h5>
                        <div className="space-y-2">
                          {result.ganaSeq.map((gana, ganaIndex) => {
                            const startIndex = ganaIndex * 3;
                            const endIndex = Math.min(
                              startIndex + 3,
                              result.syllables.length
                            );
                            const syllables = result.syllables.slice(
                              startIndex,
                              endIndex
                            );

                            return (
                              <div
                                key={ganaIndex}
                                className="flex items-center gap-2"
                              >
                                <div
                                  className={`px-3 py-2 rounded font-medium text-center min-w-[80px] ${getGanaColor(
                                    gana,
                                    ganaIndex
                                  )} ${getGanaTextColor(gana, ganaIndex)}`}
                                >
                                  <div className="text-sm font-bold">
                                    {GANAS[gana] || gana}
                                  </div>
                                  <div className="text-xs opacity-80">
                                    {gana}
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  {syllables.map((syllable, syllableIndex) => (
                                    <div
                                      key={syllableIndex}
                                      className={`px-2 py-1 rounded text-xs font-medium ${getSyllableColor(
                                        syllable
                                      )} ${getSyllableTextColor(syllable)}`}
                                    >
                                      {syllable === "S" ? "गुरु" : "लघु"}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Color Legend */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                रङ्ग सन्दर्भ
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-slate-600 font-medium mb-2">गणहरू:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(GANAS).map(([code, name], index) => (
                      <div key={code} className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded ${getGanaColor(
                            code,
                            index
                          )}`}
                        ></div>
                        <span className="text-sm text-slate-700">
                          {code}: {name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-slate-600 font-medium mb-2">
                    मात्राहरू:
                  </h4>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded ${getSyllableColor("S")}`}
                      ></div>
                      <span className="text-sm text-slate-700">गुरु (S)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded ${getSyllableColor("I")}`}
                      ></div>
                      <span className="text-sm text-slate-700">लघु (I)</span>
                    </div>
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

export default GanaVisualizer;
