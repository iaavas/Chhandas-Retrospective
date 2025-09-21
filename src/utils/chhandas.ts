import { CHHANDAS } from "./constant";

export type SYLLABLE = "S" | "I";

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

const aksharaRegex = new RegExp(
  "(?:" +
    "[\\u0904-\\u0914\\u0960-\\u0963]" +
    "|" +
    "[\\u0915-\\u0939\\u0958-\\u095F](?:\\u093C)?" +
    "(?:\\u094D[\\u0915-\\u0939\\u0958-\\u095F](?:\\u093C)?)*" +
    "(?:[\\u093E-\\u094C\\u0962\\u0963\\u093F\\u0940\\u0941\\u0942\\u0943\\u0947\\u0948\\u094B\\u094C])?" +
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

function detectSyllables(text: string): SYLLABLE[] {
  const norm = text.normalize("NFC");
  const tokens = splitAksharas(norm);
  const weights: SYLLABLE[] = [];

  for (let ti = 0; ti < tokens.length; ti++) {
    const token = tokens[ti];
    let isGuru = false;

    if (token.length === 1 && independentVowelRe.test(token)) {
      const ch = token;
      if (isIndependentLongVowel(ch)) isGuru = true;
      else if (isIndependentShortVowel(ch)) isGuru = false;
      else isGuru = false;
    }

    if (!isGuru && containsAny(token, MATRA_LONG)) isGuru = true;
    if (!isGuru && containsAny(token, DIACRITICS)) isGuru = true;
    if (!isGuru && token.endsWith(VIRAMA)) isGuru = true;

    let maybeShort = false;
    if (!isGuru) {
      if (containsAny(token, MATRA_SHORT)) maybeShort = true;
      else if (!matraRe.test(token) && consonantRe.test(token[0])) {
        maybeShort = true;
      }
    }

    if (maybeShort) {
      const next = tokens[ti + 1];
      if (next) {
        const leadCons = leadingConsonantCount(next);
        if (leadCons >= 2) isGuru = true;
      }
    }

    if (ti === tokens.length - 1) isGuru = true;

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

function detectChhanda(ganaSeq: string[]): string | null {
  for (const [name, pattern] of Object.entries(CHHANDAS)) {
    if (
      pattern.join("").replace(/-/g, "") === ganaSeq.join("").replace(/-/g, "")
    )
      return name;
  }
  return null;
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

  return { results, overallChhanda };
}
