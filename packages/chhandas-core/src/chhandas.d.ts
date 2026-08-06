import { type SYLLABLE } from "./constant.js";
export declare function splitAksharas(text: string): string[];
export interface SyllableAnalysis {
    syllables: SYLLABLE[];
    aksharaToSyllableMap: (number | null)[];
}
export declare function detectSyllablesWithMapping(text: string): SyllableAnalysis;
export declare function detectSyllables(text: string): SYLLABLE[];
export declare function detectChhanda(ganaSeq: string[]): string | null;
export interface AnustubhPadaAnalysis {
    padaIndex: number;
    syllableCount: number;
    syllables: SYLLABLE[];
    aksharas: string[];
    fifthSyllableLaghu: boolean;
    sixthSyllableGuru: boolean;
    seventhSyllableLaghu: boolean;
    isEvenPada: boolean;
    followsPattern: boolean;
    errors: string[];
    text: string;
}
export interface AnustubhResult {
    isAnustubh: boolean;
    confidence: number;
    padaAnalysis: AnustubhPadaAnalysis[];
    totalSyllables: number;
    overallErrors: string[];
    inputFormat: "4-line" | "2-line" | "other";
}
export declare function detectAnustubh(text: string): AnustubhResult;
export interface LineResult {
    line: string;
    syllables: SYLLABLE[];
    aksharas: string[];
    aksharaToSyllableMap: (number | null)[];
    ganaSeq: string[];
    chhanda: string | null;
}
export interface StanzaResult {
    results: LineResult[];
    overallChhanda: string | null;
    anustubhResult: AnustubhResult;
}
export declare function processStanza(text: string): StanzaResult;
//# sourceMappingURL=chhandas.d.ts.map