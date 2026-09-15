import React from "react";
import type { SYLLABLE } from "@chhandas/core";
import { GANAS } from "@chhandas/core";

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
}

export default function LineAnalysis({
  result,
  lineIndex,
  t,
}: LineAnalysisProps) {
  const [hoveredAkshara, setHoveredAkshara] = React.useState<number | null>(
    null
  );

  const hoveredSyllableIndex =
    hoveredAkshara !== null
      ? result.aksharaToSyllableMap[hoveredAkshara]
      : null;
  const hoveredGanaIndex =
    hoveredSyllableIndex !== null ? Math.floor(hoveredSyllableIndex / 3) : null;

  const GURU_COLOR = "bg-red-100 text-red-900";
  const LAGHU_COLOR = "bg-teal-100 text-teal-800";

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

  return (
    <div className="space-y-4">
      {/* Line Text */}
      <div className="flex justify-between items-start">
        <div>
          <span className="text-sm text-slate-500">
            {t("common.line")} {lineIndex + 1}
          </span>
          <p className="text-slate-900 text-xl mt-1">{result.line}</p>
        </div>
        {result.chhanda && (
          <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">
            {result.chhanda}
          </span>
        )}
      </div>

      {/* Tabular Analysis */}
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <div className="min-w-full inline-block">
          <table
            className="w-full text-sm"
            role="table"
            aria-label={`${t("home.lineAnalysis")} ${lineIndex + 1}`}
          >
            <tbody>
              {/* Aksharas Row */}
              <tr className="border border-slate-100">
                <th
                  className="text-slate-500 py-2 pr-4 w-20 text-center font-medium"
                  scope="row"
                >
                  {t("home.akshara")}
                </th>
                {result.aksharas.map((akshara, i) => {
                  const isHovered = hoveredAkshara === i;
                  const isInSameGana = highlightedGanaAksharas.includes(i);
                  const syllableIndex = result.aksharaToSyllableMap[i];
                  const positionInLine =
                    syllableIndex !== null ? syllableIndex + 1 : null;

                  return (
                    <td
                      key={i}
                      className={`px-2 py-2 text-center cursor-pointer transition-colors relative ${
                        isHovered
                          ? "bg-amber-100 text-slate-900 font-medium rounded"
                          : isInSameGana && hoveredAkshara !== null
                          ? GURU_COLOR
                          : "text-slate-800"
                      }`}
                      onMouseEnter={() => setHoveredAkshara(i)}
                      onMouseLeave={() => setHoveredAkshara(null)}
                      onFocus={() => setHoveredAkshara(i)}
                      onBlur={() => setHoveredAkshara(null)}
                      tabIndex={0}
                      role="gridcell"
                      aria-label={`${akshara}, position ${
                        positionInLine || i + 1
                      }`}
                    >
                      {akshara}
                      {/* Position tooltip on hover */}
                      {isHovered && positionInLine !== null && (
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-slate-700 text-white px-1.5 py-0.5 rounded whitespace-nowrap z-10 pointer-events-none">
                          #{positionInLine}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Syllable Type Row */}
              <tr className="border border-slate-100">
                <th
                  className="text-slate-500 py-2 pr-4 text-center font-medium"
                  scope="row"
                >
                  {t("common.matra")}
                </th>
                {result.aksharas.map((_, i) => {
                  const syllableIndex = result.aksharaToSyllableMap[i];
                  const isHovered = hoveredAkshara === i;
                  const isInSameGana = highlightedGanaAksharas.includes(i);

                  if (syllableIndex === null) {
                    return (
                      <td
                        key={i}
                        className={`px-2 py-2 text-center text-xs transition-colors ${
                          isInSameGana && hoveredAkshara !== null
                            ? GURU_COLOR
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
                      className={`px-2 py-2 text-center font-medium transition-colors ${
                        isHovered
                          ? isGuru
                            ? GURU_COLOR
                            : LAGHU_COLOR
                          : isInSameGana && hoveredAkshara !== null
                          ? GURU_COLOR
                          : isGuru
                          ? GURU_COLOR
                          : LAGHU_COLOR
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
              <tr className="border border-slate-100">
                <th
                  className="text-slate-500 py-2 pr-4 text-center font-medium"
                  scope="row"
                >
                  {t("home.gana")}
                </th>
                {result.aksharas.map((_, i) => {
                  const syllableIndex = result.aksharaToSyllableMap[i];
                  const isInSameGana = highlightedGanaAksharas.includes(i);

                  if (syllableIndex === null) {
                    return (
                      <td
                        key={i}
                        className={`px-2 py-2 text-center transition-colors ${
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
                      className={`px-2 py-2 text-center transition-colors ${
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
    </div>
  );
}
