import { CHHANDAS } from "./constant.js";
// ─── Unicode constants ────────────────────────────────────────────────────────
const VIRAMA = "\u094D";
const NUKTA = "\u093C";
const ANUSVARA = "\u0902";
const CHANDRA_BINDU = "\u0901";
const VISARGA = "\u0903";
const INDEPENDENT_LONG = new Set([
    "\u0906", "\u0908", "\u090A", "\u090F",
    "\u0910", "\u0913", "\u0914",
]);
const INDEPENDENT_SHORT = new Set(["\u0905", "\u0907", "\u0909", "\u090B"]);
const MATRA_LONG = new Set([
    "\u093E", "\u0940", "\u0942", "\u0947",
    "\u0948", "\u094B", "\u094C", "\u0962", "\u0963",
]);
const MATRA_SHORT = new Set(["\u093F", "\u0941", "\u0943"]);
const DIACRITICS = new Set([ANUSVARA, CHANDRA_BINDU, VISARGA]);
const consonantRe = /[\u0915-\u0939\u0958-\u095F]/u;
const independentVowelRe = /[\u0904-\u0914\u0960-\u0963]/u;
const matraRe = /[\u093E-\u094C\u0962\u0963\u093F\u0940\u0941\u0942\u0943\u0947\u0948\u094B\u094C]/u;
const matraRange = "[\\u093E-\\u094C\\u0962\\u0963]";
const aksharaRegex = new RegExp("(?:" +
    "[\\u0904-\\u0914\\u0960-\\u0963]" +
    "|" +
    "[\\u0915-\\u0939\\u0958-\\u095F](?:\\u093C)?" +
    "(?:\\u094D[\\u0915-\\u0939\\u0958-\\u095F](?:\\u093C)?)*" +
    "(?:" + matraRange + ")*" +
    "(?:\\u094D)?" +
    "(?:[\\u0901-\\u0903\\u0951-\\u0954])?" +
    ")", "gu");
// ─── Akshara splitting ────────────────────────────────────────────────────────
export function splitAksharas(text) {
    const norm = text.normalize("NFC");
    const matches = [...norm.matchAll(aksharaRegex)].map((m) => m[0]);
    return matches.length ? matches : Array.from(norm);
}
// ─── Helpers ──────────────────────────────────────────────────────────────────
function containsAny(str, set) {
    for (const ch of str)
        if (set.has(ch))
            return true;
    return false;
}
function leadingConsonantCount(token) {
    let count = 0;
    for (let i = 0; i < token.length; i++) {
        const ch = token[i];
        if (consonantRe.test(ch)) {
            count++;
            if (token[i + 1] === NUKTA)
                i++;
            if (token[i + 1] === VIRAMA)
                i += 1;
            continue;
        }
        if (matraRe.test(ch) || DIACRITICS.has(ch) || ch === VIRAMA)
            break;
        break;
    }
    return count;
}
function isPureClosingConsonant(token) {
    return (token.endsWith(VIRAMA) &&
        !containsAny(token, MATRA_LONG) &&
        !containsAny(token, MATRA_SHORT) &&
        consonantRe.test(token[0]));
}
export function detectSyllablesWithMapping(text) {
    const norm = text.normalize("NFC");
    const tokens = splitAksharas(norm);
    const weights = [];
    const aksharaToSyllableMap = [];
    for (let ti = 0; ti < tokens.length; ti++) {
        const token = tokens[ti];
        if (isPureClosingConsonant(token)) {
            if (weights.length > 0) {
                weights[weights.length - 1] = "S"; // closes previous syllable → guru
            }
            aksharaToSyllableMap.push(null);
            continue;
        }
        let isGuru = false;
        if (token.length === 1 && independentVowelRe.test(token)) {
            const ch = token;
            if (INDEPENDENT_LONG.has(ch))
                isGuru = true;
            else if (INDEPENDENT_SHORT.has(ch))
                isGuru = false;
            else
                isGuru = false;
        }
        if (!isGuru && containsAny(token, MATRA_LONG))
            isGuru = true;
        if (!isGuru && containsAny(token, DIACRITICS))
            isGuru = true;
        let maybeShort = false;
        if (!isGuru) {
            if (containsAny(token, MATRA_SHORT))
                maybeShort = true;
            else if (token.length === 1 && INDEPENDENT_SHORT.has(token))
                maybeShort = true;
            else if (!matraRe.test(token) && consonantRe.test(token[0])) {
                maybeShort = true;
            }
        }
        if (maybeShort) {
            const next = tokens[ti + 1];
            if (next) {
                if (isPureClosingConsonant(next)) {
                    isGuru = true;
                }
                else {
                    const leadCons = leadingConsonantCount(next);
                    if (leadCons >= 2)
                        isGuru = true;
                }
            }
        }
        aksharaToSyllableMap.push(weights.length);
        weights.push(isGuru ? "S" : "I");
    }
    return { syllables: weights, aksharaToSyllableMap };
}
export function detectSyllables(text) {
    return detectSyllablesWithMapping(text).syllables;
}
// ─── Gana grouping & meter matching ──────────────────────────────────────────
function toGanas(seq) {
    const result = [];
    for (let i = 0; i < seq.length; i += 3) {
        const chunk = seq.slice(i, i + 3).join("");
        if (chunk.length > 0)
            result.push(chunk);
    }
    return result;
}
export function detectChhanda(ganaSeq) {
    for (const [name, pattern] of Object.entries(CHHANDAS)) {
        if (pattern.join("").replace(/-/g, "") ===
            ganaSeq.join("").replace(/-/g, ""))
            return name;
    }
    return null;
}
function cleanSanskritText(text) {
    return text.replace(/[।॥|॰]/g, "").trim();
}
export function detectAnustubh(text) {
    const rawLines = text
        .trim()
        .split("\n")
        .filter((line) => line.trim());
    let inputFormat = "other";
    if (rawLines.length === 4)
        inputFormat = "4-line";
    else if (rawLines.length <= 2)
        inputFormat = "2-line";
    const fullCleanText = rawLines.map((l) => cleanSanskritText(l)).join("");
    const allAksharas = splitAksharas(fullCleanText);
    const allSyllables = detectSyllables(fullCleanText);
    const overallErrors = [];
    let syllableIndex = 0;
    const aksharaToSyllableMap = [];
    for (let i = 0; i < allAksharas.length; i++) {
        if (isPureClosingConsonant(allAksharas[i])) {
            aksharaToSyllableMap.push(-1);
        }
        else {
            aksharaToSyllableMap.push(syllableIndex);
            syllableIndex++;
        }
    }
    const padas = [];
    for (let padaIdx = 0; padaIdx < 4; padaIdx++) {
        const syllableStart = padaIdx * 8;
        const syllableEnd = Math.min(syllableStart + 8, allSyllables.length);
        const padaSyllables = allSyllables.slice(syllableStart, syllableEnd);
        const aksharaStart = aksharaToSyllableMap.findIndex((s) => s === syllableStart);
        let aksharaEnd = aksharaToSyllableMap.findIndex((s) => s === syllableEnd);
        if (aksharaEnd === -1)
            aksharaEnd = allAksharas.length;
        while (aksharaEnd < allAksharas.length &&
            isPureClosingConsonant(allAksharas[aksharaEnd])) {
            aksharaEnd++;
        }
        const padaAksharas = allAksharas.slice(aksharaStart, aksharaEnd);
        padas.push({ text: padaAksharas.join(""), aksharas: padaAksharas, syllables: padaSyllables });
    }
    const actualPadaCount = padas.filter((p) => p.syllables.length > 0).length;
    if (actualPadaCount !== 4) {
        overallErrors.push(`अनुष्टुभ्मा ४ पाद चाहिन्छ, तर ${actualPadaCount} पाद भेटियो`);
    }
    const padaAnalysis = padas.map((pada, index) => {
        const syllables = pada.syllables;
        const syllableCount = syllables.length;
        const errors = [];
        const isEvenPada = (index + 1) % 2 === 0;
        if (syllableCount !== 8) {
            errors.push(`पाद ${index + 1}: ८ अक्षर चाहिन्छ, तर ${syllableCount} अक्षर भेटियो`);
        }
        const fifthSyllableLaghu = syllables[4] === "I";
        const sixthSyllableGuru = syllables[5] === "S";
        const seventhSyllableLaghu = syllables[6] === "I";
        let followsPattern = false;
        if (syllables.length >= 7) {
            if (isEvenPada) {
                if (fifthSyllableLaghu && sixthSyllableGuru && seventhSyllableLaghu) {
                    followsPattern = true;
                }
                else {
                    if (!fifthSyllableLaghu)
                        errors.push(`पाद ${index + 1} (सम): ५औं अक्षर लघु हुनुपर्छ`);
                    if (!sixthSyllableGuru)
                        errors.push(`पाद ${index + 1} (सम): ६औं अक्षर गुरु हुनुपर्छ`);
                    if (!seventhSyllableLaghu)
                        errors.push(`पाद ${index + 1} (सम): ७औं अक्षर लघु हुनुपर्छ`);
                }
            }
            else {
                followsPattern = true; // Odd padas support Vipula variations
            }
        }
        return {
            padaIndex: index,
            syllableCount,
            syllables,
            aksharas: pada.aksharas,
            fifthSyllableLaghu,
            sixthSyllableGuru,
            seventhSyllableLaghu,
            isEvenPada,
            followsPattern,
            errors,
            text: pada.text,
        };
    });
    const totalSyllables = allSyllables.length;
    let confidence = 0;
    if (padas.length === 4)
        confidence += 20;
    const correctSyllableCounts = padaAnalysis.filter((p) => p.syllableCount === 8).length;
    confidence += (correctSyllableCounts / 4) * 20;
    const validEvenPadas = padaAnalysis.filter((p) => p.isEvenPada && p.followsPattern).length;
    confidence += (validEvenPadas / 2) * 60;
    const correctTotalSyllables = totalSyllables >= 30 && totalSyllables <= 34;
    const isAnustubh = correctTotalSyllables &&
        validEvenPadas === 2 &&
        confidence > 80;
    return {
        isAnustubh,
        confidence: correctTotalSyllables ? Math.round(confidence) : 0,
        padaAnalysis,
        totalSyllables,
        overallErrors: [...overallErrors, ...padaAnalysis.flatMap((p) => p.errors)],
        inputFormat,
    };
}
export function processStanza(text) {
    const lines = text
        .trim()
        .split("\n")
        .filter((line) => line.trim());
    const results = lines.map((line) => {
        const lineText = line.trim();
        const { syllables, aksharaToSyllableMap } = detectSyllablesWithMapping(lineText);
        const ganaSeq = toGanas(syllables);
        const chhanda = detectChhanda(ganaSeq);
        const aksharas = splitAksharas(lineText);
        return { line: lineText, syllables, aksharas, aksharaToSyllableMap, ganaSeq, chhanda };
    });
    const chhandas = results.map((r) => r.chhanda).filter(Boolean);
    const overallChhanda = chhandas.length > 0 && chhandas.every((c) => c === chhandas[0])
        ? chhandas[0]
        : null;
    const anustubhResult = detectAnustubh(text);
    return { results, overallChhanda, anustubhResult };
}
//# sourceMappingURL=chhandas.js.map