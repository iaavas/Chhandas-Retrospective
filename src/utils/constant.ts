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
  भुजङ्गप्रयात: ["ISS", "ISS", "ISS", "ISS"],
  शार्दूलविक्रीडित: ["SSS", "IIS", "ISI", "IIS", "SSI", "SSI", "S"],
  तोटक: ["IIS", "IIS", "IIS", "IIS"],
  मन्दाक्रान्ता: ["SSS", "SII", "III", "SSI", "SSI", "S", "S"],
  इन्द्रवज्र: ["SSI", "SSI", "ISI", "SS"],
  उपेन्द्रवज्र: ["ISI", "SSI", "ISI", "SS"],
  वंशस्थ: ["ISI", "SSI", "ISI", "SIS"],
  इन्द्रवंश: ["SSI", "SSI", "ISI", "SIS"],
  वसन्ततिलका: ["SSI", "SII", "ISI", "ISI", "SS"],
  मालिनी: ["III", "III", "SSS", "ISS", "ISS"],
  शिखरिणी: ["ISS", "SSS", "III", "IIS", "SII", "I", "S"],
  स्रग्विणी: ["SIS", "SIS", "SIS", "SIS"],
  स्रग्धरा: ["SSS", "SIS", "SII", "III", "ISS", "ISS", "ISS"],
  पृथ्वी: [
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
  द्रुतविलम्बित: ["III", "SII", "SII", "SIS"],
  हरिणी: ["III", "IIS", "SSS", "SIS", "IIS", "IS"],
  श्रवणाभरणम्: ["III", "ISI", "ISI", "ISI", "ISI", "ISI", "ISI", "IS"],
  // गीतिक छन्दहरू
  अनुष्टुप्: [], // विशेष नियम छ
  // मात्रिक छन्दहरू
  मात्रिक१४: [], // १४ मात्रा
  आर्या: [], // आर्या छन्द - विशेष मात्रिक नियम
};
