export const VOWELS = [
  "अ",
  "आ",
  "इ",
  "ई",
  "उ",
  "ऊ",
  "ऋ",
  "ॠ",
  "ऌ",
  "ॡ",
  "ए",
  "ऐ",
  "ओ",
  "औ",
  "अं",
  "अः",
];

export const CONSONANTS = [
  "क",
  "ख",
  "ग",
  "घ",
  "ङ",
  "च",
  "छ",
  "ज",
  "झ",
  "ञ",
  "ट",
  "ठ",
  "ड",
  "ढ",
  "ण",
  "त",
  "थ",
  "द",
  "ध",
  "न",
  "प",
  "फ",
  "ब",
  "भ",
  "म",
  "य",
  "र",
  "ल",
  "व",
  "श",
  "ष",
  "स",
  "ह",
  "क्ष",
  "त्र",
  "ज्ञ",
];

export const MATRAS = [
  "ा",
  "ि",
  "ी",
  "ु",
  "ू",
  "ृ",
  "े",
  "ै",
  "ो",
  "ौ",
  "ं",
  "ः",
];

export const SPECIAL_GURUS = ["ॐ", "श्री"];

export type SYLLABLE = "I" | "S"; // I = Laghu (ह्रस्व), S = Guru (दीर्घ)

export const GANAS: Record<string, string> = {
  ISS: "Ya (य)",
  SSS: "Ma (म)",
  SSI: "Ta (त)",
  SIS: "Ra (र)",
  ISI: "Ja (ज)",
  SII: "Bha (भ)",
  III: "Na (न)",
  IIS: "Sa (स)",
};

export const CHHANDAS: Record<string, string[]> = {
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
