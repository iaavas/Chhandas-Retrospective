import React from "react";
import {
  processStanza,
  splitAksharas,
  detectAnustubh,
  type AnustubhResult,
} from "./utils/chhandas";
import { GANAS, CHHANDAS, type SYLLABLE } from "./utils/constant";
import SEO, { pageSEO } from "./components/SEO";

function TestChhanda() {
  const [input, setInput] = React.useState("");
  const [selectedChhanda, setSelectedChhanda] = React.useState("");
  const [testResult, setTestResult] = React.useState<{
    isCorrect: boolean;
    overallMatchPercentage: number;
    totalMatras: number;
    correctMatras: number;
    totalGanas: number;
    correctGanas: number;
    errors: Array<{
      lineIndex: number;
      expectedPattern: string;
      actualPattern: string;
      errorPositions: number[];
      matchPercentage: number;
    }>;
    analysis: Array<{
      line: string;
      syllables: SYLLABLE[];
      ganaSeq: string[];
      expectedGanaSeq: string[];
      isCorrect: boolean;
      matchPercentage: number;
      matraErrors: Array<{
        position: number;
        expected: SYLLABLE;
        actual: SYLLABLE;
        isError: boolean;
      }>;
      ganaErrors: Array<{
        position: number;
        expected: string;
        actual: string;
        isError: boolean;
      }>;
    }>;
  } | null>(null);
  const [anustubhResult, setAnustubhResult] =
    React.useState<AnustubhResult | null>(null);

  const handleTest = () => {
    if (!input.trim() || !selectedChhanda) return;

    // Special handling for Anustubh
    if (selectedChhanda === "अनुष्टुप्") {
      const result = detectAnustubh(input);
      setAnustubhResult(result);
      setTestResult(null);
      return;
    }

    // Clear Anustubh result when testing other chhandas
    setAnustubhResult(null);

    const lines = input
      .trim()
      .split("\n")
      .filter((line) => line.trim());
    const expectedPattern = CHHANDAS[selectedChhanda];

    if (!expectedPattern || expectedPattern.length === 0) {
      alert("Selected chhanda pattern not available");
      return;
    }

    const analysis = lines.map((line) => {
      const syllables = processStanza(line).results[0].syllables;
      const ganaSeq = processStanza(line).results[0].ganaSeq;
      const expectedGanaSeq = expectedPattern;

      // Calculate matra-level errors
      const matraErrors = syllables.map((syllable, i) => {
        // For matra analysis, we need to compare against expected syllable pattern
        // Since we don't have expected syllable pattern, we'll derive it from gana pattern
        const ganaIndex = Math.floor(i / 3);
        const positionInGana = i % 3;
        const expectedGana = expectedGanaSeq[ganaIndex] || "";
        const expectedSyllable = expectedGana[positionInGana] || "";

        return {
          position: i,
          expected: expectedSyllable as SYLLABLE,
          actual: syllable,
          isError: expectedSyllable !== "" && expectedSyllable !== syllable,
        };
      });

      // Calculate gana-level errors
      const ganaErrors = ganaSeq.map((gana, i) => {
        const expectedGana = expectedGanaSeq[i] || "";
        return {
          position: i,
          expected: expectedGana,
          actual: gana,
          isError: expectedGana !== "" && expectedGana !== gana,
        };
      });

      // Calculate match percentage for this line
      const totalMatras = syllables.length;
      const correctMatras = matraErrors.filter(
        (error) => !error.isError
      ).length;
      const matchPercentage =
        totalMatras > 0 ? (correctMatras / totalMatras) * 100 : 0;

      // Compare patterns
      const isCorrect = ganaSeq.join("") === expectedGanaSeq.join("");

      return {
        line: line.trim(),
        syllables,
        ganaSeq,
        expectedGanaSeq,
        isCorrect,
        matchPercentage,
        matraErrors,
        ganaErrors,
      };
    });

    // Find errors
    const errors = analysis
      .map((result, lineIndex) => {
        const errorPositions: number[] = [];
        const maxLength = Math.max(
          result.ganaSeq.length,
          result.expectedGanaSeq.length
        );

        for (let i = 0; i < maxLength; i++) {
          const actual = result.ganaSeq[i] || "";
          const expected = result.expectedGanaSeq[i] || "";
          if (actual !== expected) {
            errorPositions.push(i);
          }
        }

        return {
          lineIndex,
          expectedPattern: result.expectedGanaSeq.join(" "),
          actualPattern: result.ganaSeq.join(" "),
          errorPositions,
          matchPercentage: result.matchPercentage,
        };
      })
      .filter((error) => error.errorPositions.length > 0);

    // Calculate overall statistics
    const totalMatras = analysis.reduce(
      (sum, result) => sum + result.syllables.length,
      0
    );
    const correctMatras = analysis.reduce(
      (sum, result) =>
        sum + result.matraErrors.filter((error) => !error.isError).length,
      0
    );

    const totalGanas = analysis.reduce(
      (sum, result) => sum + result.ganaSeq.length,
      0
    );
    const correctGanas = analysis.reduce(
      (sum, result) =>
        sum + result.ganaErrors.filter((error) => !error.isError).length,
      0
    );

    const overallMatchPercentage =
      totalMatras > 0 ? (correctMatras / totalMatras) * 100 : 0;
    const isCorrect = errors.length === 0;

    setTestResult({
      isCorrect,
      overallMatchPercentage,
      totalMatras,
      correctMatras,
      totalGanas,
      correctGanas,
      errors,
      analysis,
    });
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-24">
      <SEO {...pageSEO.test} />
      <div className="container max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-3 tracking-tight">
            छन्द परीक्षण
          </h1>
          <p className="text-slate-500 text-lg font-light">
            आफ्नो कविता कुनै विशिष्ट छन्दसँग मिल्छ कि नि जाँच गर्नुहोस्
          </p>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto mt-6"></div>
        </div>

        {/* Input Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-8 mb-8">
          <div className="space-y-6">
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

            {/* Text Input */}
            <div className="relative">
              <label className="block text-slate-700 font-medium mb-3">
                कविता वा श्लोक लेख्नुहोस्:
              </label>
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
                onClick={handleTest}
                disabled={!input.trim() || !selectedChhanda}
                className={`
                  px-8 py-3 rounded-xl font-medium text-base
                  transition-all duration-200
                  ${
                    !input.trim() || !selectedChhanda
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg shadow-slate-900/25"
                  }
                `}
              >
                परीक्षण गर्नुहोस्
              </button>
            </div>
          </div>
        </div>

        {/* Anustubh Results Section */}
        {anustubhResult && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Overall Result */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      anustubhResult.isAnustubh ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <h3 className="text-2xl font-semibold text-slate-800">
                    {anustubhResult.isAnustubh
                      ? "अनुष्टुभ् छन्द मिल्यो!"
                      : "अनुष्टुभ् छन्द मिलेन"}
                  </h3>
                </div>
                <p className="text-slate-600 mb-4">
                  {anustubhResult.isAnustubh
                    ? "आफ्नो कविता अनुष्टुभ् छन्दसँग मिल्छ।"
                    : `${anustubhResult.overallErrors.length} त्रुटि भेटिएको छ।`}
                </p>

                {/* Confidence Score */}
                <div className="bg-slate-50/50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-3xl font-bold text-slate-800">
                      {anustubhResult.confidence}%
                    </span>
                    <span className="text-slate-600">विश्वास स्कोर</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        anustubhResult.confidence >= 90
                          ? "bg-green-500"
                          : anustubhResult.confidence >= 70
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${anustubhResult.confidence}%` }}
                    ></div>
                  </div>
                </div>

                {/* Anustubh Statistics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-50/50 rounded-lg p-3">
                    <div className="text-slate-600 mb-1">कुल अक्षर</div>
                    <div className="font-semibold text-slate-800">
                      {anustubhResult.totalSyllables}
                    </div>
                    <div className="text-xs text-slate-500">अपेक्षित: ३२</div>
                  </div>
                  <div className="bg-slate-50/50 rounded-lg p-3">
                    <div className="text-slate-600 mb-1">पाद संख्या</div>
                    <div className="font-semibold text-slate-800">
                      {anustubhResult.padaAnalysis.length}
                    </div>
                    <div className="text-xs text-slate-500">अपेक्षित: ४</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Anustubh Rules Info */}
            <div className="bg-amber-50/50 backdrop-blur-sm rounded-2xl border border-amber-200/50 shadow-xl shadow-amber-200/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <h3 className="text-slate-700 font-semibold text-xl">
                  अनुष्टुभ् छन्दको नियम
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span className="text-slate-700">
                      ४ पाद, प्रत्येक पादमा ८ अक्षर
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span className="text-slate-700">कुल ३२ अक्षर</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">⬤</span>
                    <span className="text-slate-700">
                      ८औं अक्षर गुरु (अनिवार्य)
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">○</span>
                    <span className="text-slate-700">
                      ५औं अक्षर लघु (सामान्यतया)
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-500 font-bold">○</span>
                    <span className="text-slate-700">
                      सम पादमा ६औं अक्षर गुरु (सामान्यतया)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pada by Pada Analysis */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                  <h3 className="text-slate-700 font-semibold text-xl">
                    पाद अनुसार विश्लेषण
                  </h3>
                </div>

                {/* Color Legend */}
                <div className="hidden sm:flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-50 border border-red-200 rounded"></div>
                    <span className="text-slate-600">गुरु</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-50 border border-blue-200 rounded"></div>
                    <span className="text-slate-600">लघु</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-slate-600">नियम पूरा</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-slate-600">नियम उल्लंघन</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {anustubhResult.padaAnalysis.map((pada, padaIndex) => {
                  const isEvenPada = (padaIndex + 1) % 2 === 0;
                  const hasCorrectCount = pada.syllableCount === 8;

                  return (
                    <div
                      key={padaIndex}
                      className={`border-l-2 pl-6 space-y-4 ${
                        hasCorrectCount && pada.eighthSyllableGuru
                          ? "border-green-300"
                          : "border-red-300"
                      }`}
                    >
                      {/* Pada Header */}
                      <div className="bg-slate-50/10 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-slate-800 font-medium text-lg">
                            पाद {padaIndex + 1} {isEvenPada ? "(सम)" : "(विषम)"}
                            :
                          </h4>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-600">
                              {pada.syllableCount}/८ अक्षर
                            </span>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  hasCorrectCount && pada.eighthSyllableGuru
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                              ></div>
                              <span
                                className={`text-sm font-medium ${
                                  hasCorrectCount && pada.eighthSyllableGuru
                                    ? "text-green-700"
                                    : "text-red-700"
                                }`}
                              >
                                {hasCorrectCount && pada.eighthSyllableGuru
                                  ? "सही"
                                  : "गलत"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-slate-900 text-xl font-medium">
                          {pada.text}
                        </p>
                      </div>

                      {/* Rule Check Summary */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div
                          className={`rounded-lg p-2 text-center text-xs ${
                            hasCorrectCount
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          <div className="font-medium">अक्षर संख्या</div>
                          <div>{pada.syllableCount}/८</div>
                        </div>
                        <div
                          className={`rounded-lg p-2 text-center text-xs ${
                            pada.eighthSyllableGuru
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          <div className="font-medium">८औं गुरु</div>
                          <div>{pada.eighthSyllableGuru ? "✓" : "✗"}</div>
                        </div>
                        <div
                          className={`rounded-lg p-2 text-center text-xs ${
                            pada.fifthSyllableLaghu
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          <div className="font-medium">५औं लघु</div>
                          <div>{pada.fifthSyllableLaghu ? "✓" : "○"}</div>
                        </div>
                        {isEvenPada && (
                          <div
                            className={`rounded-lg p-2 text-center text-xs ${
                              pada.sixthSyllableGuru
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            <div className="font-medium">६औं गुरु</div>
                            <div>{pada.sixthSyllableGuru ? "✓" : "○"}</div>
                          </div>
                        )}
                      </div>

                      {/* Detailed Syllable Analysis Table */}
                      <div>
                        <h5 className="text-slate-600 font-medium mb-3">
                          विस्तृत विश्लेषण:
                        </h5>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="text-xs text-slate-500">
                                <td className="py-1 pr-4 border-r border-slate-200 font-medium">
                                  स्थान
                                </td>
                                {pada.syllables.map((_, i) => (
                                  <td
                                    key={i}
                                    className={`px-2 py-1 text-center border-r border-slate-100 last:border-r-0 ${
                                      i === 4 || i === 5 || i === 7
                                        ? "bg-amber-50/50 font-bold"
                                        : ""
                                    }`}
                                  >
                                    {i + 1}
                                    {i === 4 && (
                                      <span className="text-blue-500"> *</span>
                                    )}
                                    {i === 5 && isEvenPada && (
                                      <span className="text-purple-500">
                                        {" "}
                                        *
                                      </span>
                                    )}
                                    {i === 7 && (
                                      <span className="text-red-500"> *</span>
                                    )}
                                  </td>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {/* Aksharas Row */}
                              <tr>
                                <td className="text-slate-500 text-sm font-medium py-2 pr-4 border-r border-slate-200">
                                  अक्षर
                                </td>
                                {pada.aksharas.map((akshara, i) => (
                                  <td
                                    key={i}
                                    className="px-2 py-2 text-center font-medium text-slate-800 border-r border-slate-100 last:border-r-0"
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
                                {pada.syllables.map((syllable, i) => {
                                  // Determine if this position violates a rule
                                  const is8thPosition = i === 7;
                                  const is5thPosition = i === 4;
                                  const is6thPosition = i === 5 && isEvenPada;

                                  const violation8th =
                                    is8thPosition && syllable !== "S";
                                  const rule5th =
                                    is5thPosition && syllable === "I";
                                  const rule6th =
                                    is6thPosition && syllable === "S";

                                  let bgClass =
                                    syllable === "S"
                                      ? "text-red-700 bg-red-50/70"
                                      : "text-blue-700 bg-blue-50/70";

                                  if (violation8th) {
                                    bgClass = "text-white bg-red-500";
                                  } else if (
                                    is8thPosition &&
                                    syllable === "S"
                                  ) {
                                    bgClass = "text-white bg-green-500";
                                  } else if (is5thPosition) {
                                    bgClass = rule5th
                                      ? "text-white bg-green-400"
                                      : "text-amber-700 bg-amber-100";
                                  } else if (is6thPosition) {
                                    bgClass = rule6th
                                      ? "text-white bg-green-400"
                                      : "text-amber-700 bg-amber-100";
                                  }

                                  return (
                                    <td
                                      key={i}
                                      className={`px-2 py-2 text-center text-sm font-medium border-r border-slate-100 last:border-r-0 ${bgClass}`}
                                    >
                                      {syllable === "S" ? "गुरु" : "लघु"}
                                    </td>
                                  );
                                })}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Errors for this pada */}
                      {pada.errors.length > 0 && (
                        <div className="bg-red-50/50 rounded-lg p-3 border border-red-200">
                          <div className="text-sm text-red-700">
                            {pada.errors.map((error, i) => (
                              <div key={i}>{error}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Overall Errors */}
            {anustubhResult.overallErrors.length > 0 && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <h3 className="text-slate-700 font-semibold text-xl">
                    त्रुटि विवरण
                  </h3>
                </div>

                <div className="space-y-2">
                  {anustubhResult.overallErrors.map((error, errorIndex) => (
                    <div
                      key={errorIndex}
                      className="bg-red-50/50 rounded-lg p-3 border border-red-200 text-sm text-red-800"
                    >
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results Section */}
        {testResult && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Overall Result */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      testResult.isCorrect ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <h3 className="text-2xl font-semibold text-slate-800">
                    {testResult.isCorrect ? "सही छन्द!" : "छन्द मिलेन"}
                  </h3>
                </div>
                <p className="text-slate-600 mb-4">
                  {testResult.isCorrect
                    ? `आफ्नो कविता ${selectedChhanda} छन्दसँग पूर्ण रूपमा मिल्छ।`
                    : `${testResult.errors.length} हरफमा त्रुटि भेटिएको छ।`}
                </p>

                {/* Overall Match Percentage */}
                <div className="bg-slate-50/50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-3xl font-bold text-slate-800">
                      {testResult.overallMatchPercentage.toFixed(1)}%
                    </span>
                    <span className="text-slate-600">मिलान</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        testResult.overallMatchPercentage >= 90
                          ? "bg-green-500"
                          : testResult.overallMatchPercentage >= 70
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${testResult.overallMatchPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Detailed Statistics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-50/50 rounded-lg p-3">
                    <div className="text-slate-600 mb-1">मात्रा</div>
                    <div className="font-semibold text-slate-800">
                      {testResult.correctMatras}/{testResult.totalMatras}
                    </div>
                    <div className="text-xs text-slate-500">
                      {(
                        (testResult.correctMatras / testResult.totalMatras) *
                        100
                      ).toFixed(1)}
                      % सही
                    </div>
                  </div>
                  <div className="bg-slate-50/50 rounded-lg p-3">
                    <div className="text-slate-600 mb-1">गण</div>
                    <div className="font-semibold text-slate-800">
                      {testResult.correctGanas}/{testResult.totalGanas}
                    </div>
                    <div className="text-xs text-slate-500">
                      {(
                        (testResult.correctGanas / testResult.totalGanas) *
                        100
                      ).toFixed(1)}
                      % सही
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Line by Line Analysis */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                  <h3 className="text-slate-700 font-semibold text-xl">
                    हरफ अनुसार विश्लेषण
                  </h3>
                </div>

                {/* Color Legend */}
                <div className="hidden sm:flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-50 border border-red-200 rounded"></div>
                    <span className="text-slate-600">गुरु</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-50 border border-blue-200 rounded"></div>
                    <span className="text-slate-600">लघु</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-slate-600">मात्रा त्रुटि</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span className="text-slate-600">गण त्रुटि</span>
                  </div>
                </div>
              </div>

              {/* Mobile Color Legend */}
              <div className="sm:hidden mb-4 p-3 bg-slate-50/50 rounded-lg">
                <div className="text-xs text-slate-600 mb-2 font-medium">
                  रङ्गको अर्थ:
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-50 border border-red-200 rounded"></div>
                    <span className="text-slate-600">गुरु</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-50 border border-blue-200 rounded"></div>
                    <span className="text-slate-600">लघु</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-slate-600">मात्रा त्रुटि</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span className="text-slate-600">गण त्रुटि</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {testResult.analysis.map((result, lineIndex) => (
                  <div
                    key={lineIndex}
                    className={`border-l-2 pl-6 space-y-4 ${
                      result.isCorrect ? "border-green-300" : "border-red-300"
                    }`}
                  >
                    {/* Line Text */}
                    <div className="bg-slate-50/10 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-slate-800 font-medium text-lg">
                          हरफ {lineIndex + 1}:
                        </h4>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-sm font-semibold text-slate-700">
                              {result.matchPercentage.toFixed(1)}% मिलान
                            </div>
                            <div className="w-16 bg-slate-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                  result.matchPercentage >= 90
                                    ? "bg-green-500"
                                    : result.matchPercentage >= 70
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{ width: `${result.matchPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                result.isCorrect ? "bg-green-500" : "bg-red-500"
                              }`}
                            ></div>
                            <span
                              className={`text-sm font-medium ${
                                result.isCorrect
                                  ? "text-green-700"
                                  : "text-red-700"
                              }`}
                            >
                              {result.isCorrect ? "सही" : "गलत"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-900 text-xl font-medium">
                        {result.line}
                      </p>
                    </div>

                    {/* Pattern Comparison */}
                    <div className="space-y-3">
                      <h5 className="text-slate-600 font-medium">गण तुलना:</h5>

                      {/* Expected Pattern */}
                      <div>
                        <p className="text-sm text-slate-500 mb-2">
                          अपेक्षित गण:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {result.expectedGanaSeq.map((gana, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 rounded-lg text-sm font-medium border bg-green-100 text-green-800 border-green-300"
                            >
                              {GANAS[gana] || gana}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actual Pattern */}
                      <div>
                        <p className="text-sm text-slate-500 mb-2">
                          वास्तविक गण:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {result.ganaSeq.map((gana, i) => {
                            const ganaError = result.ganaErrors[i];
                            const isError = ganaError && ganaError.isError;
                            return (
                              <span
                                key={i}
                                className={`px-3 py-1 rounded-lg text-sm font-medium border ${
                                  isError
                                    ? "bg-orange-500 text-white border-orange-600 shadow-lg"
                                    : "bg-blue-100 text-blue-800 border-blue-300"
                                }`}
                              >
                                {GANAS[gana] || gana}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Detailed Analysis Table */}
                    <div>
                      <h5 className="text-slate-600 font-medium mb-3">
                        विस्तृत विश्लेषण:
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
                              {result.syllables.map((syllable, i) => {
                                const matraError = result.matraErrors[i];
                                const isError =
                                  matraError && matraError.isError;
                                return (
                                  <td
                                    key={i}
                                    className={`px-2 py-2 text-center text-sm font-medium border-r border-slate-100 last:border-r-0 ${
                                      isError
                                        ? "text-white bg-red-500 border-red-600 shadow-lg"
                                        : syllable === "S"
                                        ? "text-red-700 bg-red-50/70"
                                        : "text-blue-700 bg-blue-50/70"
                                    }`}
                                  >
                                    <div className="flex flex-col items-center">
                                      <span
                                        className={isError ? "font-bold" : ""}
                                      >
                                        {syllable === "S" ? "गुरु" : "लघु"}
                                      </span>
                                      {isError && (
                                        <span className="text-xs text-red-100 mt-1 font-medium">
                                          →
                                          {matraError.expected === "S"
                                            ? "गुरु"
                                            : "लघु"}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                );
                              })}
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
                                const expectedGana =
                                  result.expectedGanaSeq[ganaIndex];
                                const ganaError = result.ganaErrors[ganaIndex];
                                const isError = ganaError && ganaError.isError;

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
                                      isError
                                        ? "bg-orange-500 text-white border-orange-600 shadow-lg"
                                        : ganaIndex % 2 === 0
                                        ? "bg-purple-50/50 text-purple-800"
                                        : "bg-indigo-50/50 text-indigo-800"
                                    }`}
                                  >
                                    <div className="flex flex-col items-center">
                                      <span
                                        className={isError ? "font-bold" : ""}
                                      >
                                        {showGanaName
                                          ? GANAS[gana] || gana
                                          : ""}
                                      </span>
                                      {isError && showGanaName && (
                                        <span className="text-xs text-orange-100 mt-1 font-medium">
                                          →{GANAS[expectedGana] || expectedGana}
                                        </span>
                                      )}
                                    </div>
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

            {/* Error Summary */}
            {testResult.errors.length > 0 && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <h3 className="text-slate-700 font-semibold text-xl">
                    त्रुटि विवरण
                  </h3>
                </div>

                <div className="space-y-4">
                  {testResult.errors.map((error, errorIndex) => (
                    <div
                      key={errorIndex}
                      className="bg-red-50/50 rounded-lg p-4 border border-red-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-red-800 font-medium">
                          हरफ {error.lineIndex + 1}
                        </h4>
                        <span className="text-sm text-red-600">
                          {error.matchPercentage.toFixed(1)}% मिलान
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-slate-600">अपेक्षित: </span>
                          <span className="font-mono text-slate-800">
                            {error.expectedPattern}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-600">वास्तविक: </span>
                          <span className="font-mono text-slate-800">
                            {error.actualPattern}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-600">त्रुटि स्थान: </span>
                          <span className="text-red-600">
                            गण{" "}
                            {error.errorPositions
                              .map((pos) => pos + 1)
                              .join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

export default TestChhanda;
