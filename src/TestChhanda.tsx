import React from "react";
import {
  processStanza,
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
      aksharas: string[];
      aksharaToSyllableMap: (number | null)[];
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
      const lineResult = processStanza(line).results[0];
      const syllables = lineResult.syllables;
      const aksharas = lineResult.aksharas;
      const aksharaToSyllableMap = lineResult.aksharaToSyllableMap;
      const ganaSeq = lineResult.ganaSeq;
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
        aksharas,
        aksharaToSyllableMap,
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
    <main className="min-h-screen w-full bg-white pt-20">
      <SEO {...pageSEO.test} />
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-normal text-slate-900 mb-2">
            छन्द परीक्षण
          </h1>
          <p className="text-slate-500">
            आफ्नो कविता कुनै विशिष्ट छन्दसँग मिल्छ कि नि जाँच गर्नुहोस्
          </p>
        </div>

        {/* Input Section */}
        <div className="mb-8 space-y-4">
          {/* Chhanda Selection */}
          <div>
            <label className="block text-slate-700 text-sm mb-2">
              छन्द छान्नुहोस्
            </label>
            <select
              value={selectedChhanda}
              onChange={(e) => setSelectedChhanda(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded text-slate-700 focus:outline-none focus:border-slate-400"
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
          <div>
            <label className="block text-slate-700 text-sm mb-2">
              कविता वा श्लोक लेख्नुहोस्
            </label>
            <textarea
              className="w-full p-4 border border-slate-200 rounded text-slate-800 placeholder-slate-400 text-lg leading-relaxed focus:outline-none focus:border-slate-400 resize-none"
              rows={5}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="यहाँ आफ्नो कविता वा श्लोक लेख्नुहोस्..."
            />
          </div>

          <button
            onClick={handleTest}
            disabled={!input.trim() || !selectedChhanda}
            className={`px-6 py-2.5 rounded font-medium ${
              !input.trim() || !selectedChhanda
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            परीक्षण गर्नुहोस्
          </button>
        </div>

        {/* Anustubh Results Section */}
        {anustubhResult && (
          <div className="space-y-8">
            {/* Overall Result */}
            <div className="border-b border-slate-200 pb-6">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`text-xl ${
                    anustubhResult.isAnustubh
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {anustubhResult.isAnustubh ? "✓" : "✗"}
                </span>
                <h3 className="text-xl text-slate-800">
                  {anustubhResult.isAnustubh
                    ? "अनुष्टुभ् छन्द मिल्यो"
                    : "अनुष्टुभ् छन्द मिलेन"}
                </h3>
              </div>
              <p className="text-slate-500 text-sm mb-4">
                {anustubhResult.isAnustubh
                  ? "आफ्नो कविता अनुष्टुभ् छन्दसँग मिल्छ।"
                  : `${anustubhResult.overallErrors.length} त्रुटि भेटिएको छ।`}
              </p>

              {/* Stats */}
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="text-slate-500">विश्वास:</span>{" "}
                  <span className="text-slate-800 font-medium">
                    {anustubhResult.confidence}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">अक्षर:</span>{" "}
                  <span className="text-slate-800">
                    {anustubhResult.totalSyllables}/३२
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">पाद:</span>{" "}
                  <span className="text-slate-800">
                    {anustubhResult.padaAnalysis.length}/४
                  </span>
                </div>
              </div>
            </div>

            {/* Anustubh Rules Info */}
            <div className="bg-slate-50 p-4 rounded text-sm">
              <h4 className="font-medium text-slate-700 mb-2">
                अनुष्टुभ् नियम
              </h4>
              <ul className="text-slate-600 space-y-1">
                <li>• ४ पाद, प्रत्येक पादमा ८ अक्षर (कुल ३२)</li>
                <li>• ८औं अक्षर गुरु (अनिवार्य)</li>
                <li>• ५औं अक्षर लघु, सम पादमा ६औं गुरु (सामान्यतया)</li>
              </ul>
            </div>

            {/* Pada by Pada Analysis */}
            <div>
              <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2 mb-6">
                पाद अनुसार विश्लेषण
              </h3>

              <div className="space-y-8">
                {anustubhResult.padaAnalysis.map((pada, padaIndex) => {
                  const isEvenPada = (padaIndex + 1) % 2 === 0;
                  const hasCorrectCount = pada.syllableCount === 8;
                  const isCorrect = hasCorrectCount && pada.eighthSyllableGuru;

                  return (
                    <div key={padaIndex} className="space-y-4">
                      {/* Pada Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-sm text-slate-500">
                            पाद {padaIndex + 1} {isEvenPada ? "(सम)" : "(विषम)"}
                          </span>
                          <p className="text-slate-900 text-xl mt-1">
                            {pada.text}
                          </p>
                        </div>
                        <span
                          className={`text-sm ${
                            isCorrect ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {pada.syllableCount}/८ • {isCorrect ? "सही" : "गलत"}
                        </span>
                      </div>

                      {/* Rule Check Summary */}
                      <div className="flex gap-4 text-xs">
                        <span
                          className={
                            hasCorrectCount ? "text-green-600" : "text-red-600"
                          }
                        >
                          अक्षर: {pada.syllableCount}/८
                        </span>
                        <span
                          className={
                            pada.eighthSyllableGuru
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          ८औं गुरु: {pada.eighthSyllableGuru ? "✓" : "✗"}
                        </span>
                        <span
                          className={
                            pada.fifthSyllableLaghu
                              ? "text-green-600"
                              : "text-amber-600"
                          }
                        >
                          ५औं लघु: {pada.fifthSyllableLaghu ? "✓" : "○"}
                        </span>
                        {isEvenPada && (
                          <span
                            className={
                              pada.sixthSyllableGuru
                                ? "text-green-600"
                                : "text-amber-600"
                            }
                          >
                            ६औं गुरु: {pada.sixthSyllableGuru ? "✓" : "○"}
                          </span>
                        )}
                      </div>

                      {/* Analysis Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-xs text-slate-500 border-b border-slate-100">
                              <td className="py-1 pr-4 w-16">स्थान</td>
                              {pada.syllables.map((_, i) => (
                                <td key={i} className="px-2 py-1 text-center">
                                  {i + 1}
                                  {(i === 4 ||
                                    i === 7 ||
                                    (i === 5 && isEvenPada)) && (
                                    <span className="text-amber-500">*</span>
                                  )}
                                </td>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-slate-100">
                              <td className="text-slate-500 py-2 pr-4">
                                अक्षर
                              </td>
                              {pada.aksharas.map((akshara, i) => (
                                <td
                                  key={i}
                                  className="px-2 py-2 text-center text-slate-800"
                                >
                                  {akshara}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="text-slate-500 py-2 pr-4">
                                मात्रा
                              </td>
                              {pada.syllables.map((syllable, i) => {
                                const is8th = i === 7;
                                const is5th = i === 4;
                                const is6th = i === 5 && isEvenPada;

                                let textClass =
                                  syllable === "S"
                                    ? "text-red-600"
                                    : "text-blue-600";
                                if (is8th && syllable !== "S")
                                  textClass = "text-white bg-red-500";
                                else if (is8th && syllable === "S")
                                  textClass = "text-green-600 font-medium";
                                else if (is5th && syllable === "I")
                                  textClass = "text-green-600";
                                else if (is6th && syllable === "S")
                                  textClass = "text-green-600";

                                return (
                                  <td
                                    key={i}
                                    className={`px-2 py-2 text-center ${textClass}`}
                                  >
                                    {syllable === "S" ? "गुरु" : "लघु"}
                                  </td>
                                );
                              })}
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Errors */}
                      {pada.errors.length > 0 && (
                        <div className="text-sm text-red-600">
                          {pada.errors.map((error, i) => (
                            <div key={i}>• {error}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Overall Errors */}
            {anustubhResult.overallErrors.length > 0 && (
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-medium text-slate-800 mb-3">
                  त्रुटि विवरण
                </h3>
                <div className="space-y-1 text-sm text-red-600">
                  {anustubhResult.overallErrors.map((error, i) => (
                    <div key={i}>• {error}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results Section */}
        {testResult && (
          <div className="space-y-8">
            {/* Overall Result */}
            <div className="border-b border-slate-200 pb-6">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`text-xl ${
                    testResult.isCorrect ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {testResult.isCorrect ? "✓" : "✗"}
                </span>
                <h3 className="text-xl text-slate-800">
                  {testResult.isCorrect ? "सही छन्द" : "छन्द मिलेन"}
                </h3>
              </div>
              <p className="text-slate-500 text-sm mb-4">
                {testResult.isCorrect
                  ? `आफ्नो कविता ${selectedChhanda} छन्दसँग पूर्ण रूपमा मिल्छ।`
                  : `${testResult.errors.length} हरफमा त्रुटि भेटिएको छ।`}
              </p>

              {/* Stats */}
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="text-slate-500">मिलान:</span>{" "}
                  <span className="text-slate-800 font-medium">
                    {testResult.overallMatchPercentage.toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">मात्रा:</span>{" "}
                  <span className="text-slate-800">
                    {testResult.correctMatras}/{testResult.totalMatras}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">गण:</span>{" "}
                  <span className="text-slate-800">
                    {testResult.correctGanas}/{testResult.totalGanas}
                  </span>
                </div>
              </div>
            </div>

            {/* Line by Line Analysis */}
            <div>
              <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2 mb-6">
                हरफ अनुसार विश्लेषण
              </h3>

              <div className="space-y-10">
                {testResult.analysis.map((result, lineIndex) => (
                  <div key={lineIndex} className="space-y-4">
                    {/* Line Text */}
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-sm text-slate-500">
                          हरफ {lineIndex + 1}
                        </span>
                        <p className="text-slate-900 text-xl mt-1">
                          {result.line}
                        </p>
                      </div>
                      <span
                        className={`text-sm ${
                          result.isCorrect ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {result.matchPercentage.toFixed(1)}% •{" "}
                        {result.isCorrect ? "सही" : "गलत"}
                      </span>
                    </div>

                    {/* Pattern Comparison */}
                    <div className="flex gap-8 text-sm">
                      <div>
                        <span className="text-slate-500">अपेक्षित:</span>{" "}
                        <span className="text-slate-700">
                          {result.expectedGanaSeq
                            .map((g) => GANAS[g] || g)
                            .join(" ")}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">वास्तविक:</span>{" "}
                        <span className="text-slate-700">
                          {result.ganaSeq.map((g) => GANAS[g] || g).join(" ")}
                        </span>
                      </div>
                    </div>

                    {/* Analysis Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <tbody>
                          <tr className="border-b border-slate-100">
                            <td className="text-slate-500 py-2 pr-4 w-16">
                              अक्षर
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
                          <tr className="border-b border-slate-100">
                            <td className="text-slate-500 py-2 pr-4">मात्रा</td>
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
                              const matraError = result.matraErrors[syllableIndex];
                              const isError = matraError && matraError.isError;
                              return (
                                <td
                                  key={i}
                                  className={`px-2 py-2 text-center ${
                                    isError
                                      ? "text-red-600 font-medium"
                                      : syllable === "S"
                                      ? "text-red-600"
                                      : "text-blue-600"
                                  }`}
                                >
                                  {syllable === "S" ? "गुरु" : "लघु"}
                                  {isError && (
                                    <span className="text-xs block">
                                      →
                                      {matraError.expected === "S"
                                        ? "गुरु"
                                        : "लघु"}
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                          <tr>
                            <td className="text-slate-500 py-2 pr-4">गण</td>
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
                              const expectedGana =
                                result.expectedGanaSeq[ganaIndex];
                              const ganaError = result.ganaErrors[ganaIndex];
                              const isError = ganaError && ganaError.isError;
                              const showGanaName = positionInGana === 1 && gana;

                              return (
                                <td
                                  key={i}
                                  className={`px-2 py-2 text-center text-slate-700 ${
                                    positionInGana === 0
                                      ? "border-l border-slate-200"
                                      : ""
                                  } ${isError ? "text-orange-600" : ""}`}
                                >
                                  {showGanaName && (
                                    <>
                                      {GANAS[gana] || gana}
                                      {isError && (
                                        <span className="text-xs block">
                                          →{GANAS[expectedGana] || expectedGana}
                                        </span>
                                      )}
                                    </>
                                  )}
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

            {/* Error Summary */}
            {testResult.errors.length > 0 && (
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-medium text-slate-800 mb-3">
                  त्रुटि विवरण
                </h3>
                <div className="space-y-3">
                  {testResult.errors.map((error, i) => (
                    <div key={i} className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-700">
                          हरफ {error.lineIndex + 1}
                        </span>
                        <span className="text-slate-500">
                          {error.matchPercentage.toFixed(1)}% मिलान
                        </span>
                      </div>
                      <div className="text-slate-600">
                        अपेक्षित:{" "}
                        <span className="font-mono">
                          {error.expectedPattern}
                        </span>
                      </div>
                      <div className="text-slate-600">
                        वास्तविक:{" "}
                        <span className="font-mono">{error.actualPattern}</span>
                      </div>
                      <div className="text-red-600">
                        त्रुटि स्थान: गण{" "}
                        {error.errorPositions.map((pos) => pos + 1).join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default TestChhanda;
