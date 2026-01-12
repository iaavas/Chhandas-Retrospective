import SEO, { pageSEO } from "./components/SEO";
import { processStanza, type AnustubhResult } from "./utils/chhandas";
import type { SYLLABLE } from "./utils/constant";
import { useLanguage } from "./contexts/LanguageContext";
import LineAnalysis from "./components/LineAnalysis";
import React from "react";

export default function Home() {
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
  const [copied, setCopied] = React.useState(false);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const resultRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedPoem = params.get("poem");
    if (sharedPoem) {
      try {
        const decoded = decodeURIComponent(sharedPoem);
        setInput(decoded);
        setTimeout(() => {
          const result = processStanza(decoded);
          setOutput(result);
        }, 100);
      } catch (err) {
        console.error("Error loading shared poem:", err);
      }
    }
  }, []);

  const handleCheck = () => {
    if (!input.trim()) {
      setError("Please enter some text to analyze");
      return;
    }

    setError(null);
    setIsAnalyzing(true);

    setTimeout(() => {
      try {
        const result = processStanza(input);
        setOutput(result);
        setTimeout(() => {
          resultRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      } catch (err) {
        setError("An error occurred while analyzing. Please try again.");
        console.error("Analysis error:", err);
      } finally {
        setIsAnalyzing(false);
      }
    }, 100);
  };

  const handleClear = () => {
    setInput("");
    setOutput(null);
    setError(null);
    setIsAnalyzing(false);
    window.history.replaceState({}, "", window.location.pathname);
  };

  const handleShare = async () => {
    const encoded = encodeURIComponent(input);
    const shareUrl = `${window.location.origin}${window.location.pathname}?poem=${encoded}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && input.trim()) {
      handleCheck();
    }
  };

  const detectedChhanda = output?.overallChhanda
    ? output.overallChhanda
    : output?.anustubhResult?.isAnustubh
    ? "अनुष्टुप्"
    : null;

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
          <h1 className="text-2xl font-normal text-slate-900 ">
            {t("home.title")}
          </h1>
        </div>

        {/* Input Section */}
        <div className="mb-8">
          {/* Poetry editor with line numbers */}
          <div className="poetry-editor">
            {/* Line numbers gutter */}

            {/* Textarea */}
            <textarea
              className="w-full border border-blue-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-lg p-4"
              rows={Math.max(5, input.split("\n").length)}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder={t("home.placeholder")}
              aria-label="Poetry input"
              aria-describedby="input-hint"
              id="poetry-input"
            />
          </div>
          <p id="input-hint" className="sr-only">
            Enter your poetry lines. Press Command+Enter or Control+Enter to
            analyze.
          </p>

          {/* Error message */}
          {error && (
            <div
              className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2 animate-analysis-reveal"
              role="alert"
              aria-live="polite"
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Input stats and actions */}
          <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
            <div className="text-sm text-slate-400">
              {lineCount > 0 ? (
                <span>
                  {lineCount}{" "}
                  {lineCount === 1 ? t("common.line") : t("common.lines")}
                </span>
              ) : (
                <span className="text-slate-300">⌘+Enter to analyze</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Clear button - visible when there's input */}
              {input.trim() && (
                <button
                  onClick={handleClear}
                  className="px-3 py-2 rounded text-sm font-medium transition-colors border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-1 flex items-center gap-1.5"
                  title={t("common.clear")}
                  aria-label={t("common.clear")}
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span>{t("common.clear")}</span>
                </button>
              )}
              {/* Share button */}
              {input.trim() && (
                <button
                  onClick={handleShare}
                  className="relative px-3 py-2 rounded text-sm font-medium transition-colors border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-1 flex items-center gap-1.5"
                  title="Share link"
                  aria-label="Share link"
                >
                  {copied ? (
                    <>
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
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
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                      </svg>
                      <span>Share</span>
                    </>
                  )}
                </button>
              )}
              {/* Analyze button */}
              <button
                onClick={handleCheck}
                disabled={!input.trim() || isAnalyzing}
                className={`px-5 py-2 rounded text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  !input.trim() || isAnalyzing
                    ? "bg-blue-600 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
                }`}
                aria-label={t("common.analyze")}
              >
                {isAnalyzing ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  t("common.analyze")
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Detected Chhanda */}
        {detectedChhanda && (
          <div
            ref={resultRef}
            className="mb-10 py-8 text-center bg-slate-50/60 -mx-4 px-4"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="text-xs text-slate-400 uppercase tracking-wider block mb-2">
              छन्द
            </span>
            <span
              className="text-slate-900 text-6xl"
              aria-label={`Detected chhanda: ${detectedChhanda}`}
            >
              {detectedChhanda}
            </span>
            {detectedChhanda === "अनुष्टुप्" &&
              output?.anustubhResult?.isAnustubh && (
                <span
                  className="block text-sm text-slate-600 mt-2"
                  aria-label={`Confidence: ${output.anustubhResult.confidence}%`}
                >
                  {output.anustubhResult.confidence}%
                </span>
              )}
            <div className="mt-4 text-xs text-slate-600">
              {totalSyllables} अक्षर • {output?.results.length} पंक्ति
            </div>
          </div>
        )}

        {/* No chhanda detected */}
        {output && !detectedChhanda && (
          <div
            ref={resultRef}
            className="mb-10 py-6 text-center text-slate-500 bg-slate-50 -mx-4 px-4"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg
                className="w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium">कुनै छन्द पहिचान भएन</span>
            </div>
            <div className="mt-2 text-xs text-slate-400">
              {totalSyllables} अक्षर • {output?.results.length} पंक्ति
            </div>
          </div>
        )}

        {output && (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-lg font-medium text-slate-800">
                {t("home.lineAnalysis")}
              </h3>
              {/* Legend */}
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-800"></span>
                  <span className="text-slate-600">गुरु (G)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-600"></span>
                  <span className="text-slate-600">लघु (L)</span>
                </span>
              </div>
            </div>

            <div className="space-y-20">
              {output.results.map((result, lineIndex) => (
                <LineAnalysis
                  key={lineIndex}
                  result={result}
                  lineIndex={lineIndex}
                  t={t}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
