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

// LineAnalysis component with hover interactions
interface LineAnalysisProps {
  result: {
    line: string;
    syllables: SYLLABLE[];
    aksharas: string[];
    aksharaToSyllableMap: (number | null)[];
    ganaSeq: string[];
    chhanda: string | null;
  };
  lineIndex: number;
  t: (key: string) => string;
  animationKey?: number;
}

function LineAnalysis({
  result,
  lineIndex,
  t,
  animationKey,
}: LineAnalysisProps) {
  const [hoveredAkshara, setHoveredAkshara] = React.useState<number | null>(
    null
  );

  // Get stagger class for animation
  const getStaggerClass = (index: number) => {
    const staggerIndex = Math.min(index + 1, 10);
    return `stagger-${staggerIndex}`;
  };

  // Get the syllable index and gana info for the hovered akshara
  const hoveredSyllableIndex =
    hoveredAkshara !== null
      ? result.aksharaToSyllableMap[hoveredAkshara]
      : null;
  const hoveredGanaIndex =
    hoveredSyllableIndex !== null ? Math.floor(hoveredSyllableIndex / 3) : null;

  // Find all aksharas that belong to the same gana
  const getGanaAksharaIndices = (ganaIndex: number) => {
    const indices: number[] = [];
    result.aksharas.forEach((_, i) => {
      const syllableIdx = result.aksharaToSyllableMap[i];
      if (syllableIdx !== null && Math.floor(syllableIdx / 3) === ganaIndex) {
        indices.push(i);
      }
    });
    return indices;
  };

  const highlightedGanaAksharas =
    hoveredGanaIndex !== null ? getGanaAksharaIndices(hoveredGanaIndex) : [];

  // Line animation delay based on line index
  const lineDelay = lineIndex * 0.1;

  return (
    <div
      className="space-y-4 animate-analysis-reveal"
      style={{ animationDelay: `${lineDelay}s` }}
    >
      {/* Line Text */}
      <div className="flex justify-between items-start">
        <div>
          <span className="text-sm text-slate-500">
            {t("common.line")} {lineIndex + 1}
          </span>
          <p className="text-slate-900 text-xl mt-1">{result.line}</p>
        </div>
        {result.chhanda && (
          <span
            className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded animate-wave-in"
            style={{ animationDelay: `${lineDelay + 0.2}s` }}
          >
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
              {result.aksharas.map((akshara, i) => {
                const isHovered = hoveredAkshara === i;
                const isInSameGana = highlightedGanaAksharas.includes(i);
                const syllableIndex = result.aksharaToSyllableMap[i];
                const positionInLine =
                  syllableIndex !== null ? syllableIndex + 1 : null;

                return (
                  <td
                    key={`${animationKey}-${i}`}
                    className={`px-2 py-2 text-center cursor-pointer transition-all duration-150 relative animate-syllable-wave ${getStaggerClass(
                      i
                    )} ${
                      isHovered
                        ? "bg-amber-100 text-slate-900 font-medium rounded"
                        : isInSameGana && hoveredAkshara !== null
                        ? "bg-slate-100"
                        : "text-slate-800"
                    }`}
                    style={{ animationDelay: `${lineDelay + i * 0.03}s` }}
                    onMouseEnter={() => setHoveredAkshara(i)}
                    onMouseLeave={() => setHoveredAkshara(null)}
                  >
                    {akshara}
                    {/* Position tooltip on hover */}
                    {isHovered && positionInLine !== null && (
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-slate-700 text-white px-1.5 py-0.5 rounded whitespace-nowrap">
                        #{positionInLine}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Syllable Type Row */}
            <tr className="border-b border-slate-100">
              <td className="text-slate-500 py-2 pr-4">{t("common.matra")}</td>
              {result.aksharas.map((_, i) => {
                const syllableIndex = result.aksharaToSyllableMap[i];
                const isHovered = hoveredAkshara === i;
                const isInSameGana = highlightedGanaAksharas.includes(i);

                if (syllableIndex === null) {
                  return (
                    <td
                      key={i}
                      className={`px-2 py-2 text-center text-xs transition-all duration-150 ${
                        isInSameGana && hoveredAkshara !== null
                          ? "bg-slate-100 text-slate-500"
                          : "text-slate-400"
                      }`}
                      title="यो अक्षर अघिल्लो मात्रा बन्द गर्छ"
                      onMouseEnter={() => setHoveredAkshara(i)}
                      onMouseLeave={() => setHoveredAkshara(null)}
                    >
                      —
                    </td>
                  );
                }
                const syllable = result.syllables[syllableIndex];
                const isGuru = syllable === "S";

                return (
                  <td
                    key={i}
                    className={`px-2 py-2 text-center font-medium transition-all duration-150 ${
                      isHovered
                        ? isGuru
                          ? "bg-purple-100 text-purple-900"
                          : "bg-teal-100 text-teal-800"
                        : isInSameGana && hoveredAkshara !== null
                        ? "bg-slate-100"
                        : isGuru
                        ? "text-purple-800"
                        : "text-teal-600"
                    }`}
                    onMouseEnter={() => setHoveredAkshara(i)}
                    onMouseLeave={() => setHoveredAkshara(null)}
                  >
                    {isGuru ? t("common.guru") : t("common.laghu")}
                  </td>
                );
              })}
            </tr>

            {/* Gana Pattern Row */}
            <tr>
              <td className="text-slate-500 py-2 pr-4">{t("home.gana")}</td>
              {result.aksharas.map((_, i) => {
                const syllableIndex = result.aksharaToSyllableMap[i];
                const isInSameGana = highlightedGanaAksharas.includes(i);

                if (syllableIndex === null) {
                  return (
                    <td
                      key={i}
                      className={`px-2 py-2 text-center transition-all duration-150 ${
                        isInSameGana && hoveredAkshara !== null
                          ? "bg-slate-100"
                          : ""
                      }`}
                      onMouseEnter={() => setHoveredAkshara(i)}
                      onMouseLeave={() => setHoveredAkshara(null)}
                    ></td>
                  );
                }

                const ganaIndex = Math.floor(syllableIndex / 3);
                const positionInGana = syllableIndex % 3;
                const gana = result.ganaSeq[ganaIndex];
                const showGanaName = positionInGana === 1 && gana;
                const isHoveredGana =
                  hoveredGanaIndex === ganaIndex && hoveredAkshara !== null;

                return (
                  <td
                    key={i}
                    className={`px-2 py-2 text-center transition-all duration-150 ${
                      positionInGana === 0 ? "border-l border-slate-200" : ""
                    } ${
                      isHoveredGana
                        ? "bg-amber-50 text-slate-900 font-medium"
                        : "text-slate-700"
                    }`}
                    onMouseEnter={() => setHoveredAkshara(i)}
                    onMouseLeave={() => setHoveredAkshara(null)}
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
  );
}

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
  const [copied, setCopied] = React.useState(false);
  const [animationKey, setAnimationKey] = React.useState(0);
  const [soundEnabled, setSoundEnabled] = React.useState(false);
  const resultRef = React.useRef<HTMLDivElement>(null);

  // Load shared poem from URL on mount
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedPoem = params.get("poem");
    if (sharedPoem) {
      try {
        const decoded = decodeURIComponent(sharedPoem);
        setInput(decoded);
        // Auto-analyze after loading
        setTimeout(() => {
          const result = processStanza(decoded);
          setOutput(result);
          setAnimationKey((k) => k + 1);
        }, 100);
      } catch {
        // Invalid encoding, ignore
      }
    }
    // Load sound preference from localStorage
    const savedSound = localStorage.getItem("chhandas-sound");
    if (savedSound === "true") setSoundEnabled(true);
  }, []);

  // Play soft chime on analysis complete
  const playAnalysisSound = React.useCallback(() => {
    if (!soundEnabled) return;
    try {
      const audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(
        659.25,
        audioContext.currentTime + 0.1
      ); // E5
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch {
      // Audio not supported, ignore
    }
  }, [soundEnabled]);

  const handleCheck = () => {
    const result = processStanza(input);
    setOutput(result);
    setAnimationKey((k) => k + 1);
    playAnalysisSound();
    // Scroll to results after a brief delay
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem("chhandas-sound", String(newValue));
  };

  const handleClear = () => {
    setInput("");
    setOutput(null);
    // Clear URL params
    window.history.replaceState({}, "", window.location.pathname);
  };

  // Share link functionality
  const handleShare = async () => {
    const encoded = encodeURIComponent(input);
    const shareUrl = `${window.location.origin}${window.location.pathname}?poem=${encoded}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
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
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-normal text-slate-900 mb-2">
                {t("home.title")}
              </h1>
              <p className="text-slate-500">{t("home.subtitle")}</p>
            </div>
            {/* Sound toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-lg transition-colors ${
                soundEnabled
                  ? "bg-purple-100 text-purple-700"
                  : "bg-slate-100 text-slate-400 hover:text-slate-600"
              }`}
              title={soundEnabled ? "Sound on" : "Sound off (click to enable)"}
            >
              {soundEnabled ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                  />
                </svg>
              )}
            </button>
          </div>
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
            <div className="flex items-center gap-2">
              {/* Share button */}
              {input.trim() && (
                <button
                  onClick={handleShare}
                  className="relative px-3 py-2 rounded text-sm font-medium transition-colors border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 flex items-center gap-1.5"
                  title="Share link"
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
        </div>

        {/* Detected Chhanda */}
        {detectedChhanda && (
          <div
            key={`result-${animationKey}`}
            ref={resultRef}
            className="mb-10 py-8 text-center bg-slate-50 -mx-4 px-4 animate-wave-in"
          >
            <span className="text-xs text-slate-400 uppercase tracking-wider block mb-2 animate-analysis-reveal">
              छन्द
            </span>
            <span className="text-slate-900 text-4xl animate-gentle-pulse">
              {detectedChhanda}
            </span>
            {output?.anustubhResult?.isAnustubh && (
              <span
                className="block text-sm text-slate-400 mt-2 animate-analysis-reveal"
                style={{ animationDelay: "0.1s" }}
              >
                {output.anustubhResult.confidence}%
              </span>
            )}
            <div
              className="mt-4 text-xs text-slate-400 animate-analysis-reveal"
              style={{ animationDelay: "0.15s" }}
            >
              {totalSyllables} अक्षर • {output?.results.length} पंक्ति
            </div>
          </div>
        )}

        {/* No chhanda detected */}
        {output && !detectedChhanda && (
          <div
            key={`no-result-${animationKey}`}
            ref={resultRef}
            className="mb-10 py-6 text-center text-slate-500 bg-slate-50 -mx-4 px-4 animate-wave-in"
          >
            <span className="text-sm">कुनै छन्द पहिचान भएन</span>
            <div
              className="mt-2 text-xs text-slate-400 animate-analysis-reveal"
              style={{ animationDelay: "0.1s" }}
            >
              {totalSyllables} अक्षर • {output?.results.length} पंक्ति
            </div>
          </div>
        )}

        {/* Results Section */}
        {output && (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-lg font-medium text-slate-800">
                {t("home.lineAnalysis")}
              </h3>
              {/* Legend */}
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-purple-800"></span>
                  <span className="text-slate-600">गुरु (G)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                  <span className="text-slate-600">लघु (L)</span>
                </span>
              </div>
            </div>

            <div className="space-y-10">
              {output.results.map((result, lineIndex) => (
                <LineAnalysis
                  key={`${animationKey}-${lineIndex}`}
                  result={result}
                  lineIndex={lineIndex}
                  t={t}
                  animationKey={animationKey}
                />
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
