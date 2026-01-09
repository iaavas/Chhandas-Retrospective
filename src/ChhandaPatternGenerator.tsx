import React from "react";
import { GANAS, CHHANDAS } from "./utils/constant";
import { useLanguage } from "./contexts/LanguageContext";
import SEO, { pageSEO } from "./components/SEO";

function ChhandaPatternGenerator() {
  const { t } = useLanguage();
  const [selectedChhanda, setSelectedChhanda] = React.useState("");
  const [generatedPattern, setGeneratedPattern] = React.useState<string[]>([]);
  const [patternCount, setPatternCount] = React.useState(4);
  const [customPattern, setCustomPattern] = React.useState("");
  const [isCustomMode, setIsCustomMode] = React.useState(false);

  const generateRandomPattern = () => {
    if (isCustomMode && customPattern.trim()) {
      // Generate pattern based on custom gana sequence
      const ganas = customPattern
        .trim()
        .split(/\s+/)
        .filter((g) => g.length > 0);
      setGeneratedPattern(ganas);
      return;
    }

    if (selectedChhanda && CHHANDAS[selectedChhanda]) {
      // Generate pattern based on selected chhanda
      const basePattern = CHHANDAS[selectedChhanda];
      if (basePattern.length > 0) {
        setGeneratedPattern(basePattern);
        return;
      }
    }

    // Generate random pattern
    const ganaKeys = Object.keys(GANAS);
    const randomPattern: string[] = [];

    for (let i = 0; i < patternCount; i++) {
      const randomGana = ganaKeys[Math.floor(Math.random() * ganaKeys.length)];
      randomPattern.push(randomGana);
    }

    setGeneratedPattern(randomPattern);
  };

  const generateMultiplePatterns = () => {
    const patterns: string[][] = [];
    const ganaKeys = Object.keys(GANAS);

    for (let p = 0; p < 5; p++) {
      const pattern: string[] = [];
      for (let i = 0; i < patternCount; i++) {
        const randomGana =
          ganaKeys[Math.floor(Math.random() * ganaKeys.length)];
        pattern.push(randomGana);
      }
      patterns.push(pattern);
    }

    return patterns;
  };

  const [multiplePatterns, setMultiplePatterns] = React.useState<string[][]>(
    []
  );

  const generateMultiple = () => {
    setMultiplePatterns(generateMultiplePatterns());
  };

  const copyPattern = (pattern: string[]) => {
    navigator.clipboard.writeText(pattern.join(" "));
  };

  const exportPatterns = () => {
    const data = {
      singlePattern: generatedPattern,
      multiplePatterns: multiplePatterns,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chhanda-patterns.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-24">
      <SEO {...pageSEO.patternGenerator} />
      <div className="container max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-3 tracking-tight">
            {t("patternGenerator.title")}
          </h1>
          <p className="text-slate-500 text-lg font-light">
            {t("patternGenerator.subtitle")}
          </p>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto mt-6"></div>
        </div>

        {/* Input Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-8 mb-8">
          <div className="space-y-6">
            {/* Mode Selection */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setIsCustomMode(false)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  !isCustomMode
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                छन्द छान्नुहोस्
              </button>
              <button
                onClick={() => setIsCustomMode(true)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isCustomMode
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                कस्टम प्याटर्न
              </button>
            </div>

            {!isCustomMode ? (
              <>
                {/* Chhanda Selection */}
                <div>
                  <label className="block text-slate-700 font-medium mb-3">
                    छन्द छान्नुहोस्:
                  </label>
                  <select
                    value={selectedChhanda}
                    onChange={(e) => setSelectedChhanda(e.target.value)}
                    className="w-full p-4 bg-slate-50/50 border-0 rounded-xl text-slate-700 text-lg focus:outline-none focus:ring-2 focus:ring-slate-300/50 focus:bg-white/80 transition-all duration-200"
                  >
                    <option value="">छन्द छान्नुहोस्...</option>
                    {Object.keys(CHHANDAS).map((chhanda) => (
                      <option key={chhanda} value={chhanda}>
                        {chhanda}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pattern Count */}
                <div>
                  <label className="block text-slate-700 font-medium mb-3">
                    गणको संख्या:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={patternCount}
                    onChange={(e) =>
                      setPatternCount(parseInt(e.target.value) || 4)
                    }
                    className="w-full p-4 bg-slate-50/50 border-0 rounded-xl text-slate-700 text-lg focus:outline-none focus:ring-2 focus:ring-slate-300/50 focus:bg-white/80 transition-all duration-200"
                  />
                </div>
              </>
            ) : (
              /* Custom Pattern Input */
              <div>
                <label className="block text-slate-700 font-medium mb-3">
                  कस्टम गण प्याटर्न (गणहरू बीचमा स्पेस राख्नुहोस्):
                </label>
                <input
                  type="text"
                  value={customPattern}
                  onChange={(e) => setCustomPattern(e.target.value)}
                  placeholder="उदाहरण: ISS SSS SII III"
                  className="w-full p-4 bg-slate-50/50 border-0 rounded-xl text-slate-700 text-lg focus:outline-none focus:ring-2 focus:ring-slate-300/50 focus:bg-white/80 transition-all duration-200"
                />
                <p className="text-sm text-slate-500 mt-2">
                  उपलब्ध गणहरू: {Object.keys(GANAS).join(", ")}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={generateRandomPattern}
                className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 hover:shadow-lg shadow-slate-900/25 transition-all duration-200"
              >
                प्याटर्न जनरेट गर्नुहोस्
              </button>
              <button
                onClick={generateMultiple}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 hover:shadow-lg shadow-blue-600/25 transition-all duration-200"
              >
                धेरै प्याटर्नहरू जनरेट गर्नुहोस्
              </button>
              <button
                onClick={exportPatterns}
                disabled={
                  generatedPattern.length === 0 && multiplePatterns.length === 0
                }
                className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 hover:shadow-lg shadow-green-600/25 transition-all duration-200 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                निर्यात गर्नुहोस्
              </button>
            </div>
          </div>
        </div>

        {/* Generated Pattern Display */}
        {generatedPattern.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-800">
                उत्पादित प्याटर्न
              </h3>
              <button
                onClick={() => copyPattern(generatedPattern)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all duration-200"
              >
                कपी गर्नुहोस्
              </button>
            </div>

            <div className="space-y-4">
              {/* Pattern as Gana Names */}
              <div>
                <h4 className="text-slate-600 font-medium mb-2">गण नामहरू:</h4>
                <div className="flex flex-wrap gap-2">
                  {generatedPattern.map((gana, i) => (
                    <span
                      key={i}
                      className="px-3 py-2 bg-purple-100 text-purple-800 rounded-lg font-medium border border-purple-200"
                    >
                      {GANAS[gana] || gana}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pattern as Gana Codes */}
              <div>
                <h4 className="text-slate-600 font-medium mb-2">गण कोडहरू:</h4>
                <div className="flex flex-wrap gap-2">
                  {generatedPattern.map((gana, i) => (
                    <span
                      key={i}
                      className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg font-mono text-sm border border-blue-200"
                    >
                      {gana}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pattern as Text */}
              <div>
                <h4 className="text-slate-600 font-medium mb-2">
                  प्याटर्न टेक्स्ट:
                </h4>
                <div className="p-4 bg-slate-50 rounded-lg font-mono text-slate-800">
                  {generatedPattern.join(" ")}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Multiple Patterns Display */}
        {multiplePatterns.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">
              धेरै प्याटर्नहरू
            </h3>

            <div className="space-y-4">
              {multiplePatterns.map((pattern, patternIndex) => (
                <div
                  key={patternIndex}
                  className="border border-slate-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-slate-700">
                      प्याटर्न {patternIndex + 1}
                    </h4>
                    <button
                      onClick={() => copyPattern(pattern)}
                      className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-sm hover:bg-slate-200 transition-all duration-200"
                    >
                      कपी
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {pattern.map((gana, ganaIndex) => (
                        <span
                          key={ganaIndex}
                          className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-sm font-medium"
                        >
                          {GANAS[gana] || gana}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      {pattern.join(" ")}
                    </div>
                  </div>
                </div>
              ))}
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

export default ChhandaPatternGenerator;
