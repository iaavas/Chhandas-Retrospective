import React from "react";
import { processStanza } from "./utils/chhandas";
import { GANAS, type SYLLABLE } from "./utils/constant";

function ChhandaComparison() {
  const [poem1, setPoem1] = React.useState("");
  const [poem2, setPoem2] = React.useState("");
  const [comparison, setComparison] = React.useState<{
    poem1Analysis: {
      results: Array<{
        line: string;
        syllables: SYLLABLE[];
        ganaSeq: string[];
        chhanda: string | null;
      }>;
      overallChhanda: string | null;
    };
    poem2Analysis: {
      results: Array<{
        line: string;
        syllables: SYLLABLE[];
        ganaSeq: string[];
        chhanda: string | null;
      }>;
      overallChhanda: string | null;
    };
    comparison: {
      sameChhanda: boolean;
      samePattern: boolean;
      similarityPercentage: number;
      differences: Array<{
        lineIndex: number;
        poem1Pattern: string;
        poem2Pattern: string;
        match: boolean;
      }>;
    };
  } | null>(null);

  const comparePoems = () => {
    if (!poem1.trim() || !poem2.trim()) return;

    const poem1Analysis = processStanza(poem1);
    const poem2Analysis = processStanza(poem2);

    // Compare patterns
    const poem1Pattern = poem1Analysis.results.map((r) => r.ganaSeq.join(" "));
    const poem2Pattern = poem2Analysis.results.map((r) => r.ganaSeq.join(" "));

    const differences = poem1Pattern.map((pattern, index) => ({
      lineIndex: index,
      poem1Pattern: pattern,
      poem2Pattern: poem2Pattern[index] || "",
      match: pattern === (poem2Pattern[index] || ""),
    }));

    const samePattern = differences.every((d) => d.match);
    const sameChhanda =
      poem1Analysis.overallChhanda === poem2Analysis.overallChhanda &&
      poem1Analysis.overallChhanda !== null;

    const totalLines = Math.max(
      poem1Analysis.results.length,
      poem2Analysis.results.length
    );
    const matchingLines = differences.filter((d) => d.match).length;
    const similarityPercentage =
      totalLines > 0 ? (matchingLines / totalLines) * 100 : 0;

    setComparison({
      poem1Analysis,
      poem2Analysis,
      comparison: {
        sameChhanda,
        samePattern,
        similarityPercentage,
        differences,
      },
    });
  };

  const exportComparison = () => {
    if (!comparison) return;

    const data = {
      poem1: poem1,
      poem2: poem2,
      comparison: comparison,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chhanda-comparison.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSimilarityColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getSimilarityBgColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-24">
      <div className="container max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-3 tracking-tight">
            छन्द तुलना उपकरण
          </h1>
          <p className="text-slate-500 text-lg font-light">
            दुई कविताहरूको छन्द तुलना गर्नुहोस्
          </p>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto mt-6"></div>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Poem 1 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              कविता १
            </h3>
            <textarea
              className="w-full p-4 bg-slate-50/50 border-0 rounded-xl text-slate-700 placeholder-slate-400 text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-slate-300/50 focus:bg-white/80 transition-all duration-200 resize-none"
              rows={8}
              value={poem1}
              onChange={(e) => setPoem1(e.target.value)}
              placeholder="पहिलो कविता लेख्नुहोस्..."
            />
          </div>

          {/* Poem 2 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              कविता २
            </h3>
            <textarea
              className="w-full p-4 bg-slate-50/50 border-0 rounded-xl text-slate-700 placeholder-slate-400 text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-slate-300/50 focus:bg-white/80 transition-all duration-200 resize-none"
              rows={8}
              value={poem2}
              onChange={(e) => setPoem2(e.target.value)}
              placeholder="दोस्रो कविता लेख्नुहोस्..."
            />
          </div>
        </div>

        {/* Compare Button */}
        <div className="text-center mb-8">
          <button
            onClick={comparePoems}
            disabled={!poem1.trim() || !poem2.trim()}
            className={`
              px-8 py-3 rounded-xl font-medium text-base
              transition-all duration-200
              ${
                !poem1.trim() || !poem2.trim()
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg shadow-slate-900/25"
              }
            `}
          >
            तुलना गर्नुहोस्
          </button>
        </div>

        {/* Comparison Results */}
        {comparison && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Overall Comparison */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-800">
                  तुलना परिणाम
                </h3>
                <button
                  onClick={exportComparison}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
                >
                  निर्यात गर्नुहोस्
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Same Chhanda */}
                <div className="text-center p-4 rounded-lg bg-slate-50/50">
                  <div
                    className={`text-2xl font-bold mb-2 ${
                      comparison.comparison.sameChhanda
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {comparison.comparison.sameChhanda ? "✓" : "✗"}
                  </div>
                  <div className="text-sm text-slate-600">समान छन्द</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {comparison.comparison.sameChhanda ? "हो" : "होइन"}
                  </div>
                </div>

                {/* Same Pattern */}
                <div className="text-center p-4 rounded-lg bg-slate-50/50">
                  <div
                    className={`text-2xl font-bold mb-2 ${
                      comparison.comparison.samePattern
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {comparison.comparison.samePattern ? "✓" : "✗"}
                  </div>
                  <div className="text-sm text-slate-600">समान प्याटर्न</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {comparison.comparison.samePattern ? "हो" : "होइन"}
                  </div>
                </div>

                {/* Similarity Percentage */}
                <div className="text-center p-4 rounded-lg bg-slate-50/50">
                  <div
                    className={`text-2xl font-bold mb-2 ${getSimilarityColor(
                      comparison.comparison.similarityPercentage
                    )}`}
                  >
                    {comparison.comparison.similarityPercentage.toFixed(1)}%
                  </div>
                  <div className="text-sm text-slate-600">समानता</div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getSimilarityBgColor(
                        comparison.comparison.similarityPercentage
                      )}`}
                      style={{
                        width: `${comparison.comparison.similarityPercentage}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Chhanda Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50/50 rounded-lg">
                  <h4 className="font-medium text-slate-700 mb-2">
                    कविता १ को छन्द
                  </h4>
                  <div className="text-slate-800">
                    {comparison.poem1Analysis.overallChhanda ||
                      "छन्द पहिचान भएन"}
                  </div>
                </div>
                <div className="p-4 bg-slate-50/50 rounded-lg">
                  <h4 className="font-medium text-slate-700 mb-2">
                    कविता २ को छन्द
                  </h4>
                  <div className="text-slate-800">
                    {comparison.poem2Analysis.overallChhanda ||
                      "छन्द पहिचान भएन"}
                  </div>
                </div>
              </div>
            </div>

            {/* Line by Line Comparison */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-6">
                हरफ अनुसार तुलना
              </h3>

              <div className="space-y-4">
                {comparison.comparison.differences.map((diff, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      diff.match
                        ? "border-green-300 bg-green-50/30"
                        : "border-red-300 bg-red-50/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-slate-700">
                        हरफ {index + 1}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-lg font-bold ${
                            diff.match ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {diff.match ? "✓" : "✗"}
                        </span>
                        <span className="text-sm text-slate-500">
                          {diff.match ? "मिल्छ" : "मिल्दैन"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-slate-600 mb-2">
                          कविता १:
                        </h5>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <div className="text-slate-800 mb-2">
                            {comparison.poem1Analysis.results[index]?.line ||
                              "हरफ छैन"}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {diff.poem1Pattern.split(" ").map((gana, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                              >
                                {GANAS[gana] || gana}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium text-slate-600 mb-2">
                          कविता २:
                        </h5>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <div className="text-slate-800 mb-2">
                            {comparison.poem2Analysis.results[index]?.line ||
                              "हरफ छैन"}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {diff.poem2Pattern.split(" ").map((gana, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium"
                              >
                                {GANAS[gana] || gana}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Poem 1 Analysis */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  कविता १ को विस्तृत विश्लेषण
                </h3>
                <div className="space-y-3">
                  {comparison.poem1Analysis.results.map((result, index) => (
                    <div key={index} className="p-3 bg-slate-50/50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-slate-700">
                          हरफ {index + 1}
                        </h4>
                        {result.chhanda && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                            {result.chhanda}
                          </span>
                        )}
                      </div>
                      <div className="text-slate-800 mb-2">{result.line}</div>
                      <div className="flex flex-wrap gap-1">
                        {result.ganaSeq.map((gana, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                          >
                            {GANAS[gana] || gana}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Poem 2 Analysis */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  कविता २ को विस्तृत विश्लेषण
                </h3>
                <div className="space-y-3">
                  {comparison.poem2Analysis.results.map((result, index) => (
                    <div key={index} className="p-3 bg-slate-50/50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-slate-700">
                          हरफ {index + 1}
                        </h4>
                        {result.chhanda && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                            {result.chhanda}
                          </span>
                        )}
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

export default ChhandaComparison;
