import { CHHANDAS } from "./constant";

export type SYLLABLE = "S" | "I";

// Anustubh detection rules
export interface AnustubhPadaAnalysis {
  padaIndex: number;
  syllableCount: number;
  syllables: SYLLABLE[];
  aksharas: string[];
  eighthSyllableGuru: boolean;
  fifthSyllableLaghu: boolean;
  sixthSyllableGuru?: boolean; // Only for even padas
  errors: string[];
  text: string;
}

export interface AnustubhResult {
  isAnustubh: boolean;
  confidence: number; // 0-100
  padaAnalysis: AnustubhPadaAnalysis[];
  totalSyllables: number;
  overallErrors: string[];
  inputFormat: "4-line" | "2-line" | "other";
}

const VIRAMA = "\u094D";
const NUKTA = "\u093C";
const ANUSVARA = "\u0902";
const CHANDRA_BINDU = "\u0901";
const VISARGA = "\u0903";

const INDEPENDENT_LONG = new Set([
  "\u0906",
  "\u0908",
  "\u090A",
  "\u090F",
  "\u0910",
  "\u0913",
  "\u0914",
]);
const INDEPENDENT_SHORT = new Set(["\u0905", "\u0907", "\u0909", "\u090B"]);

const MATRA_LONG = new Set([
  "\u093E",
  "\u0940",
  "\u0942",
  "\u0947",
  "\u0948",
  "\u094B",
  "\u094C",
  "\u0962",
  "\u0963",
]);
const MATRA_SHORT = new Set(["\u093F", "\u0941", "\u0943"]);

const DIACRITICS = new Set([ANUSVARA, CHANDRA_BINDU, VISARGA]);

const consonantRe = /[\u0915-\u0939\u0958-\u095F]/u;
const independentVowelRe = /[\u0904-\u0914\u0960-\u0963]/u;
const matraRe =
  /[\u093E-\u094C\u0962\u0963\u093F\u0940\u0941\u0942\u0943\u0947\u0948\u094B\u094C]/u;

const matraRange = "[\\u093E-\\u094C\\u0962\\u0963]";

const aksharaRegex = new RegExp(
  "(?:" +
    "[\\u0904-\\u0914\\u0960-\\u0963]" +
    "|" +
    "[\\u0915-\\u0939\\u0958-\\u095F](?:\\u093C)?" +
    "(?:\\u094D[\\u0915-\\u0939\\u0958-\\u095F](?:\\u093C)?)*" +
    "(?:" +
    matraRange +
    ")*" + // Multiple matras allowed
    "(?:\\u094D)?" + // Trailing virama
    "(?:[\\u0901-\\u0903\\u0951-\\u0954])?" +
    ")",
  "gu"
);
export function splitAksharas(text: string): string[] {
  const norm = text.normalize("NFC");
  const matches = [...norm.matchAll(aksharaRegex)].map((m) => m[0]);
  return matches.length ? matches : Array.from(norm);
}

function containsAny(str: string, set: Set<string>): boolean {
  for (const ch of str) if (set.has(ch)) return true;
  return false;
}

function isIndependentLongVowel(ch: string): boolean {
  return INDEPENDENT_LONG.has(ch);
}

function isIndependentShortVowel(ch: string): boolean {
  return INDEPENDENT_SHORT.has(ch);
}

function leadingConsonantCount(token: string): number {
  let count = 0;
  for (let i = 0; i < token.length; i++) {
    const ch = token[i];
    if (consonantRe.test(ch)) {
      count++;
      if (token[i + 1] === NUKTA) i++;
      if (token[i + 1] === VIRAMA) i += 1;
      continue;
    }
    if (matraRe.test(ch) || DIACRITICS.has(ch) || ch === VIRAMA) break;
    break;
  }
  return count;
}

/**
 * Check if a token is a pure closing consonant (has no vowel).
 * Examples: म्, क्, न् - these end with virama and have no matra or independent vowel.
 * These should not be counted as separate syllables but close the previous syllable.
 */
function isPureClosingConsonant(token: string): boolean {
  return (
    token.endsWith(VIRAMA) &&
    !containsAny(token, MATRA_LONG) &&
    !containsAny(token, MATRA_SHORT) &&
    consonantRe.test(token[0])
  );
}

export function detectSyllables(text: string): SYLLABLE[] {
  const norm = text.normalize("NFC");
  const tokens = splitAksharas(norm);
  const weights: SYLLABLE[] = [];

  for (let ti = 0; ti < tokens.length; ti++) {
    const token = tokens[ti];

    // Skip pure closing consonants (like म्, क्) - they have no vowel
    // They close the previous syllable, making it guru
    if (isPureClosingConsonant(token)) {
      if (weights.length > 0) {
        weights[weights.length - 1] = "S"; // Previous syllable becomes guru (closed)
      }
      continue; // Don't count this as a separate syllable
    }

    let isGuru = false;

    if (token.length === 1 && independentVowelRe.test(token)) {
      const ch = token;
      if (isIndependentLongVowel(ch)) isGuru = true;
      else if (isIndependentShortVowel(ch)) isGuru = false;
      else isGuru = false;
    }

    if (!isGuru && containsAny(token, MATRA_LONG)) isGuru = true;
    if (!isGuru && containsAny(token, DIACRITICS)) isGuru = true;

    let maybeShort = false;
    if (!isGuru) {
      if (containsAny(token, MATRA_SHORT)) maybeShort = true;
      // Independent short vowels (अ, इ, उ, ऋ) can also become guru if followed by consonant cluster
      else if (token.length === 1 && isIndependentShortVowel(token))
        maybeShort = true;
      else if (!matraRe.test(token) && consonantRe.test(token[0])) {
        maybeShort = true;
      }
    }

    if (maybeShort) {
      const next = tokens[ti + 1];
      if (next) {
        // Check if next token is a pure closing consonant (closes this syllable)
        if (isPureClosingConsonant(next)) {
          isGuru = true;
        } else {
          // Check if next token starts with consonant cluster
          const leadCons = leadingConsonantCount(next);
          if (leadCons >= 2) isGuru = true;
        }
      }
    }

    weights.push(isGuru ? "S" : "I");
  }

  return weights;
}

function toGanas(seq: SYLLABLE[]): string[] {
  const result: string[] = [];
  for (let i = 0; i < seq.length; i += 3) {
    const chunk = seq.slice(i, i + 3).join("");
    if (chunk.length > 0) result.push(chunk);
  }
  return result;
}

export function detectChhanda(ganaSeq: string[]): string | null {
  for (const [name, pattern] of Object.entries(CHHANDAS)) {
    if (
      pattern.join("").replace(/-/g, "") === ganaSeq.join("").replace(/-/g, "")
    )
      return name;
  }
  return null;
}

/**
 * Cleans Sanskrit text by removing punctuation marks (danda, double danda, etc.)
 */
function cleanSanskritText(text: string): string {
  // Remove । (danda), ॥ (double danda), and other punctuation
  return text.replace(/[।॥|॰]/g, "").trim();
}

/**
 * Splits a line into padas based on syllable count
 * Each pada should have 8 syllables for Anustubh
 */
function splitIntoPadas(text: string): { text: string; aksharas: string[] }[] {
  const cleanText = cleanSanskritText(text);
  const aksharas = splitAksharas(cleanText);

  // If we have approximately 16 syllables, split into 2 padas of 8 each
  if (aksharas.length >= 14 && aksharas.length <= 18) {
    const midPoint = 8;
    return [
      {
        text: aksharas.slice(0, midPoint).join(""),
        aksharas: aksharas.slice(0, midPoint),
      },
      {
        text: aksharas.slice(midPoint).join(""),
        aksharas: aksharas.slice(midPoint),
      },
    ];
  }

  // Otherwise return as single pada
  return [{ text: cleanText, aksharas }];
}

/**
 * Detects if a stanza follows Anustubh (अनुष्टुभ्) meter rules
 *
 * Rules:
 * - 4 padas (quarters/lines)
 * - 8 syllables per pada
 * - 32 total syllables
 * - 8th syllable of each pada should be guru (mandatory)
 * - 5th syllable is often laghu (common but not mandatory)
 * - In even padas (2, 4), 6th syllable is often guru (not mandatory)
 *
 * Supports both formats:
 * - 4-line format: one pada per line
 * - 2-line format: two padas per line (traditional Sanskrit format)
 */
export function detectAnustubh(text: string): AnustubhResult {
  const rawLines = text
    .trim()
    .split("\n")
    .filter((line) => line.trim());

  // Determine input format and extract padas
  let padas: { text: string; aksharas: string[] }[] = [];
  let inputFormat: "4-line" | "2-line" | "other" = "other";

  if (rawLines.length === 4) {
    // 4-line format: one pada per line
    inputFormat = "4-line";
    padas = rawLines.map((line) => {
      const cleanText = cleanSanskritText(line);
      return {
        text: cleanText,
        aksharas: splitAksharas(cleanText),
      };
    });
  } else if (rawLines.length === 2) {
    // 2-line format: two padas per line (traditional format)
    inputFormat = "2-line";
    for (const line of rawLines) {
      const linePadas = splitIntoPadas(line);
      padas.push(...linePadas);
    }
  } else if (rawLines.length === 1) {
    // Single line - might contain all 4 padas or just partial
    const allAksharas = splitAksharas(cleanSanskritText(rawLines[0]));
    if (allAksharas.length >= 28 && allAksharas.length <= 36) {
      // Likely all 4 padas in one line
      inputFormat = "2-line";
      for (let i = 0; i < 4; i++) {
        const start = i * 8;
        const end = Math.min(start + 8, allAksharas.length);
        padas.push({
          text: allAksharas.slice(start, end).join(""),
          aksharas: allAksharas.slice(start, end),
        });
      }
    } else {
      inputFormat = "other";
      padas = rawLines.map((line) => {
        const cleanText = cleanSanskritText(line);
        return {
          text: cleanText,
          aksharas: splitAksharas(cleanText),
        };
      });
    }
  } else {
    // Other format - process as is
    padas = rawLines.map((line) => {
      const cleanText = cleanSanskritText(line);
      return {
        text: cleanText,
        aksharas: splitAksharas(cleanText),
      };
    });
  }

  const overallErrors: string[] = [];
  let totalSyllables = 0;
  let mandatoryRulesMet = 0;
  let totalMandatoryRules = 0;
  let optionalRulesMet = 0;
  let totalOptionalRules = 0;

  // Check if we have 4 padas
  if (padas.length !== 4) {
    overallErrors.push(
      `अनुष्टुभ्मा ४ पाद चाहिन्छ, तर ${padas.length} पाद भेटियो`
    );
  }

  const padaAnalysis: AnustubhPadaAnalysis[] = padas.map((pada, index) => {
    const syllables = detectSyllables(pada.text);
    const syllableCount = syllables.length;
    totalSyllables += syllableCount;
    const errors: string[] = [];

    // Check syllable count (should be 8)
    const correctSyllableCount = syllableCount === 8;
    if (!correctSyllableCount) {
      errors.push(
        `पाद ${index + 1}: ८ अक्षर चाहिन्छ, तर ${syllableCount} अक्षर भेटियो`
      );
    }

    // Check 8th syllable is guru (mandatory)
    totalMandatoryRules++;
    const eighthSyllableGuru = syllables[7] === "S";
    if (!eighthSyllableGuru && syllables.length >= 8) {
      errors.push(`पाद ${index + 1}: ८औं अक्षर गुरु हुनुपर्छ (अनिवार्य)`);
    } else if (eighthSyllableGuru) {
      mandatoryRulesMet++;
    }

    // Check 5th syllable is laghu (common but not mandatory)
    totalOptionalRules++;
    const fifthSyllableLaghu = syllables[4] === "I";
    if (fifthSyllableLaghu) {
      optionalRulesMet++;
    }

    // For even padas (2, 4), check 6th syllable is guru
    let sixthSyllableGuru: boolean | undefined;
    if ((index + 1) % 2 === 0) {
      totalOptionalRules++;
      sixthSyllableGuru = syllables[5] === "S";
      if (sixthSyllableGuru) {
        optionalRulesMet++;
      }
    }

    return {
      padaIndex: index,
      syllableCount,
      syllables,
      aksharas: pada.aksharas,
      eighthSyllableGuru,
      fifthSyllableLaghu,
      sixthSyllableGuru,
      errors,
      text: pada.text,
    };
  });

  // Calculate confidence score
  // Mandatory rules: 4 padas + correct syllable count + 8th syllable guru = much higher weight
  // Optional rules: 5th laghu, 6th guru for even padas = lower weight

  const padaCountCorrect = padas.length === 4;
  const syllableCountsCorrect = padaAnalysis.every(
    (p) => p.syllableCount === 8
  );

  // Base score from mandatory rules
  let confidence = 0;

  if (padaCountCorrect) {
    confidence += 30; // 30% for having 4 padas
  }

  if (syllableCountsCorrect) {
    confidence += 30; // 30% for correct syllable counts
  } else {
    // Partial credit based on how close we are
    const correctPadas = padaAnalysis.filter(
      (p) => p.syllableCount === 8
    ).length;
    confidence += (correctPadas / 4) * 30;
  }

  // 8th syllable guru (mandatory) - 30%
  if (totalMandatoryRules > 0) {
    confidence += (mandatoryRulesMet / totalMandatoryRules) * 30;
  }

  // Optional rules - 10%
  if (totalOptionalRules > 0) {
    confidence += (optionalRulesMet / totalOptionalRules) * 10;
  }

  // Determine if it's Anustubh (needs at least 70% confidence and must have 4 padas with 8 syllables each)
  const isAnustubh =
    padaCountCorrect &&
    syllableCountsCorrect &&
    mandatoryRulesMet >= Math.floor(totalMandatoryRules * 0.75); // At least 75% of 8th syllables should be guru

  return {
    isAnustubh,
    confidence: Math.round(confidence),
    padaAnalysis,
    totalSyllables,
    overallErrors: [...overallErrors, ...padaAnalysis.flatMap((p) => p.errors)],
    inputFormat,
  };
}

export function processStanza(text: string) {
  const lines = text
    .trim()
    .split("\n")
    .filter((line) => line.trim());
  const results = lines.map((line) => {
    const syllables = detectSyllables(line.trim());
    const ganaSeq = toGanas(syllables);
    const chhanda = detectChhanda(ganaSeq);
    return {
      line: line.trim(),
      syllables,
      ganaSeq,
      chhanda,
    };
  });

  const chhandas = results.map((r) => r.chhanda).filter(Boolean);
  const overallChhanda =
    chhandas.length > 0 && chhandas.every((c) => c === chhandas[0])
      ? chhandas[0]
      : null;

  // Also check for Anustubh
  const anustubhResult = detectAnustubh(text);

  return { results, overallChhanda, anustubhResult };
}
