export type Syllable = "I" | "S"; // I = Laghu (ह्रस्व), S = Guru (दीर्घ)

export const ganas: Record<string, string> = {
  ISS: "Ya (य)",
  SSS: "Ma (म)",
  SSI: "Ta (त)",
  SIS: "Ra (र)",
  ISI: "Ja (ज)",
  SII: "Bha (भ)",
  III: "Na (न)",
  IIS: "Sa (स)",
};

export const chhandas: Record<string, string[]> = {
  Bhujangaprayata: ["ISS", "ISS", "ISS", "ISS"],
  Shardulavikridita: ["SSS", "IIS", "ISI", "IIS", "SSI", "SSI", "S"],
  Totaka: ["IIS", "IIS", "IIS", "IIS"],
  Mandakranta: ["SSS", "SII", "III", "SSI", "SSI", "S", "S"],
  Indravajra: ["SSI", "SSI", "ISI", "SS"],
  Upendravajra: ["ISI", "SSI", "ISI", "SS"],
  Vanshastha: ["ISI", "SSI", "ISI", "SIS"],
  Indravamsha: ["SSI", "SSI", "ISI", "SIS"],
  Vasantatilaka: ["SSI", "SII", "ISI", "ISI", "SS"],
  Malini: ["III", "III", "SSS", "ISS", "ISS"],
  Shikarini: ["ISS", "SSS", "III", "IIS", "SII", "I", "S"],
  Sragvini: ["SIS", "SIS", "SIS", "SIS"],
  Sragdhara: ["SSS", "SIS", "SII", "III", "ISS", "ISS", "ISS"],
  Prithvi: [
    "III",
    "III",
    "SSS",
    "ISS",
    "ISS",
    "III",
    "III",
    "SSS",
    "ISS",
    "ISS",
  ],
  Drutavilambita: ["III", "SII", "SII", "SIS"],
  Harini: ["III", "IIS", "SSS", "SIS", "IIS", "IS"],
  // गीतिक छन्दहरू
  Anushtup: [], // विशेष नियम छ
  // मात्रिक छन्दहरू
  Matrik14: [], // १४ मात्रा
  Arya: [], // आर्या छन्द - विशेष मात्रिक नियम
};

// 🔹 Detect Laghu vs Guru (simplified)
export function detectSyllables(text: string): Syllable[] {
  const laghu = /[अइउऋ]/;
  const guru = /[आईऊएऐओऔःं]/;

  return text.split("").map((ch, i, arr) => {
    if (guru.test(ch)) return "S";
    if (laghu.test(ch)) {
      // If next char is halant (्), anusvara (ं), visarga (ः), make it Guru
      if (["ं", "ः", "्"].includes(arr[i + 1])) return "S";
      return "I";
    }
    return "S"; // default safe fallback
  });
}

export function toGanas(seq: Syllable[]): string[] {
  const result: string[] = [];
  for (let i = 0; i < seq.length; i += 3) {
    const chunk = seq.slice(i, i + 3).join("");
    if (chunk.length === 3) result.push(chunk);
  }
  return result;
}

export function detectChhanda(ganaSeq: string[]): string | null {
  for (const [name, pattern] of Object.entries(chhandas)) {
    if (pattern.join("-") === ganaSeq.join("-")) return name;
  }
  return null;
}
