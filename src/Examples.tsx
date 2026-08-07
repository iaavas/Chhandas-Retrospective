"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "./contexts/LanguageContext";

type Example = {
  id: number;
  title: string;
  titleEn: string;
  chhanda: string;
  chhandaEn: string;
  text: string;
  source: string;
  sourceEn: string;
};

const EXAMPLES: Example[] = [
  {
    id: 1,
    title: "अनुष्टुप् छन्द",
    titleEn: "Anustubh",
    chhanda: "अनुष्टुप्",
    chhandaEn: "8 × 4 syllables",
    text: `धर्मक्षेत्रे कुरुक्षेत्रे
समवेता युयुत्सवः
मामकाः पाण्डवाश्चैव
किमकुर्वत सञ्जय`,
    source: "भगवद्गीता",
    sourceEn: "Bhagavad Gita",
  },
  {
    id: 2,
    title: "शार्दूलविक्रीडित छन्द",
    titleEn: "Shardulvikridit",
    chhanda: "शार्दूलविक्रीडित",
    chhandaEn: "19 syllables",
    text: `या कुन्देन्दुतुषारहारधवला या शुभ्रवस्त्रावृता
या वीणावरदण्डमण्डितकरा या श्वेतपद्मासना`,
    source: "सरस्वती वन्दना",
    sourceEn: "Saraswati Prayer",
  },
  {
    id: 3,
    title: "वसन्ततिलका छन्द",
    titleEn: "Vasantatilaka",
    chhanda: "वसन्ततिलका",
    chhandaEn: "14 syllables",
    text: `फुल्दो लतासरि छ यो बुझ जिन्दगानी ।
थाक्रो दिएर धर्तीको अनि शील पानी ।।
राम्रो दिएर यसको गर छाँटकाँट ।
फुल्ने छ यो सकल मग्मग दिव्यठाँट ।।`,
    source: "प्रेम काव्य",
    sourceEn: "Love Poetry",
  },
  {
    id: 4,
    title: "इन्द्रवज्रा छन्द",
    titleEn: "Indravajra",
    chhanda: "इन्द्रवज्रा",
    chhandaEn: "11 syllables",
    text: `अर्थो हि कन्या परकीय एव,
तामद्य सम्प्रेष्य परिग्रहीतृः।
जातो ममायं विशदः प्रकामं,
प्रत्यर्पितन्यास इवान्तरात्मा॥`,
    source: "स्तुति काव्य",
    sourceEn: "Devotional Poetry",
  },
  {
    id: 5,
    title: "मालिनी छन्द",
    titleEn: "Malini",
    chhanda: "मालिनी",
    chhandaEn: "15 syllables",
    text: `ननु वयमपि तुल्याः पार्थिवस्यात्मभूताः
तव किमनुचितं वा तत्र यत्नं विधत्स्व`,
    source: "शाकुन्तलम्",
    sourceEn: "Shakuntalam",
  },
  {
    id: 6,
    title: "मन्दाक्रान्ता छन्द",
    titleEn: "Mandakranta",
    chhanda: "मन्दाक्रान्ता",
    chhandaEn: "17 syllables",
    text: `मेघालोके भवति सुखिनोऽप्यन्यथावृत्तिचेतः
कन्ठाश्लेषप्रणयिनि जने किं पुनर्दूरसंस्थे`,
    source: "मेघदूत",
    sourceEn: "Meghadoot",
  },
  {
    id: 7,
    title: "उपेन्द्रवज्रा छन्द",
    titleEn: "Upendravajra",
    chhanda: "उपेन्द्रवज्रा",
    chhandaEn: "11 syllables",
    text: `उपेन्द्रवज्रा वसुधेन्द्रवंश्या
जगत्प्रसूतिः सुरभी बभूव`,
    source: "वंश वर्णन",
    sourceEn: "Dynasty Verse",
  },
];

export default function ChhandaAnthology() {
  const [lang, setLang] = useState<"ne" | "en">("ne");
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    setLang(currentLanguage as "ne" | "en");
  }, [currentLanguage]);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const isNe = lang === "ne";

  const handleCopy = async (example: Example) => {
    try {
      await navigator.clipboard.writeText(example.text);
      setCopiedId(example.id);
      window.setTimeout(
        () => setCopiedId((cur) => (cur === example.id ? null : cur)),
        1800,
      );
    } catch {
      console.log("clipboard copy failed");
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-normal text-slate-900 mb-2">
            {isNe
              ? "शास्त्रीय पद्यका छन्दहरू"
              : "The Meters of Classical Verse"}
          </h1>
          <p className="text-slate-500">
            {isNe
              ? "सात शास्त्रीय पद्य, तिनका छन्दअनुसार क्रमबद्ध। प्रत्येक पद्य प्रतिलिपि गरी विश्लेषण गर्न सकिन्छ।"
              : "Seven classical verses, arranged by their poetic meter. Copy any verse to analyze its chhanda."}
          </p>
        </div>

        {/* Index of verses */}
        <ol className="space-y-8">
          {EXAMPLES.map((example, index) => {
            const copied = copiedId === example.id;
            return (
              <li
                key={example.id}
                className="border-b border-slate-200 pb-8 last:border-0"
              >
                <div>
                  {/* Title row */}
                  <div className="mb-1 flex items-baseline justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 text-sm w-6">
                        {index + 1}.
                      </span>
                      <h2 className="text-lg font-medium text-slate-800">
                        {isNe ? example.title : example.titleEn}
                      </h2>
                    </div>
                  </div>

                  {/* Source */}
                  <p className="mb-4 pl-9 text-xs font-medium uppercase tracking-wider text-[#01ABFD]">
                    {isNe ? example.source : example.sourceEn}
                  </p>

                  {/* The verse */}
                  <div className="pl-9">
                    <p className="whitespace-pre-wrap p-4 border-l-2 border-slate-200 pl-4 text-base text-slate-600 leading-relaxed">
                      {example.text}
                    </p>

                    {/* Copy button */}
                    <button
                      type="button"
                      onClick={() => handleCopy(example)}
                      aria-label={
                        isNe
                          ? `${example.title} प्रतिलिपि गर्नुहोस्`
                          : `Copy ${example.titleEn}`
                      }
                      className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-slate-800 focus:outline-none cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <CheckIcon />
                          <span className="text-emerald-600">
                            {isNe ? "प्रतिलिपि भयो" : "Copied"}
                          </span>
                        </>
                      ) : (
                        <>
                          <CopyIcon />
                          <span>
                            {isNe ? "पद्य प्रतिलिपि गर्नुहोस्" : "Copy verse"}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Footer */}
        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500 leading-relaxed">
          {isNe
            ? "छन्द भनेको पद्यको अक्षर वा मात्राको नियमित संरचना हो।"
            : "A chhanda is the fixed metrical structure — the pattern of syllables — that shapes a verse."}
        </footer>
      </div>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="11" height="11" rx="1" />
      <path d="M5 15V5a1 1 0 0 1 1-1h10" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 text-emerald-600"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
