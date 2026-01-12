import { useNavigate } from "react-router-dom";
import { useLanguage } from "./contexts/LanguageContext";
import SEO, { pageSEO } from "./components/SEO";

// 10 Classic Nepali/Sanskrit poetry examples with different Chhandas
const EXAMPLES = [
  {
    id: 1,
    title: "अनुष्टुप् छन्द",
    titleEn: "Anustubh",
    chhanda: "अनुष्टुप्",
    text: `धर्मक्षेत्रे कुरुक्षेत्रे
समवेता युयुत्सवः
मामकाः पाण्डवाश्चैव
किमकुर्वत सञ्जय`,
    description: "भगवद्गीता",
    descriptionEn: "Bhagavad Gita"
  },
  {
    id: 2,
    title: "शार्दूलविक्रीडित छन्द",
    titleEn: "Shardulvikridit",
    chhanda: "शार्दूलविक्रीडित",
    text: `या कुन्देन्दुतुषारहारधवला या शुभ्रवस्त्रावृता
या वीणावरदण्डमण्डितकरा या श्वेतपद्मासना`,
    description: "सरस्वती वन्दना",
    descriptionEn: "Saraswati Prayer"
  },
  {
    id: 3,
    title: "वसन्ततिलका छन्द",
    titleEn: "Vasantatilaka",
    chhanda: "वसन्ततिलका",
    text: `उद्दीप्यते प्रणयिनीषु न तादृशीषु
तारास्तनाद्रिविहृतौ च न द्रष्टृषाम्`,
    description: "प्रेम काव्य",
    descriptionEn: "Love Poetry"
  },
  {
    id: 4,
    title: "इन्द्रवज्रा छन्द",
    titleEn: "Indravajra",
    chhanda: "इन्द्रवज्रा",
    text: `माता धाता पितुर्गतिर्महीपते
तं मां वृणीष्व महादेवि पापात्`,
    description: "स्तुति काव्य",
    descriptionEn: "Devotional Poetry"
  },
  {
    id: 5,
    title: "मालिनी छन्द",
    titleEn: "Malini",
    chhanda: "मालिनी",
    text: `ननु वयमपि तुल्याः पार्थिवस्यात्मभूताः
तव किमनुचितं वा तत्र यत्नं विधत्स्व`,
    description: "शाकुन्तलम्बाट",
    descriptionEn: "Shakuntalam"
  },
  {
    id: 6,
    title: "मन्दाक्रान्ता छन्द",
    titleEn: "Mandakranta",
    chhanda: "मन्दाक्रान्ता",
    text: `मेघालोके भवति सुखिनोऽप्यन्यथावृत्तिचेतः
कन्ठाश्लेषप्रणयिनि जने किं पुनर्दूरसंस्थे`,
    description: "मेघदूतबाट",
    descriptionEn: "Meghadoot"
  },
  {
    id: 7,
    title: "उपेन्द्रवज्रा छन्द",
    titleEn: "Upendravajra",
    chhanda: "उपेन्द्रवज्रा",
    text: `उपेन्द्रवज्रा वसुधेन्द्रवंश्या
जगत्प्रसूतिः सुरभी बभूव`,
    description: "वंश वर्णन",
    descriptionEn: "Dynasty"
  },
  {
    id: 8,
    title: "द्रुतविलम्बित छन्द",
    titleEn: "Drutavilambita",
    chhanda: "द्रुतविलम्बित",
    text: `न खलु गोपिकानन्दनो भवान्
अखिलदेहिनामन्तरात्मदृक्`,
    description: "श्रीमद्भागवत",
    descriptionEn: "Bhagavatam"
  },
  {
    id: 9,
    title: "स्रग्धरा छन्द",
    titleEn: "Sragdhara",
    chhanda: "स्रग्धरा",
    text: `श्रीवत्साङ्कं पृथुकुचतटं कौस्तुभालंकृताङ्गं
पीताम्बर्ं सुरुचिरातिसुन्दरं नीलजीमूतकान्तम्`,
    description: "भगवान विष्णु",
    descriptionEn: "Lord Vishnu"
  },
  {
    id: 10,
    title: "शिखरिणी छन्द",
    titleEn: "Shikhirini",
    chhanda: "शिखरिणी",
    text: `रसमयी वसन्ताशोके तपवने विलासिनी
मधुकरी झंकृतिप्रगीतं मधुरमुदीरयति`,
    description: "वसन्त वर्णन",
    descriptionEn: "Spring"
  }
];

export default function Examples() {
  const { t, currentLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleExampleClick = (text: string) => {
    const encoded = encodeURIComponent(text);
    navigate(`/?poem=${encoded}`);
  };

  return (
    <main className="min-h-screen w-full bg-white pt-20">
      <SEO {...pageSEO.home} />
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-semibold text-slate-900 mb-3">
            {t("examples.title")}
          </h1>
          <p className="text-lg text-slate-500">{t("examples.subtitle")}</p>
        </div>

        {/* Examples Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {EXAMPLES.map((example) => (
            <button
              key={example.id}
              onClick={() => handleExampleClick(example.text)}
              className="text-left p-6 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              aria-label={`${currentLanguage === "ne" ? example.title : example.titleEn} - ${t("examples.clickToAnalyze")}`}
            >
              {/* Title & Badge */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="text-xl font-medium text-slate-800 group-hover:text-slate-900">
                  {currentLanguage === "ne" ? example.title : example.titleEn}
                </h3>
                <span className="text-sm px-3 py-1 rounded-md bg-slate-100 text-slate-600 font-medium whitespace-nowrap">
                  {example.chhanda}
                </span>
              </div>
              
              {/* Description */}
              <p className="text-base text-slate-500 mb-4">
                {currentLanguage === "ne" ? example.description : example.descriptionEn}
              </p>
              
              {/* Preview Text */}
              <div className="bg-slate-50 rounded-md p-4 border border-slate-100">
                <pre className="text-base text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {example.text}
                </pre>
              </div>

              {/* Click hint */}
              <div className="mt-4 flex items-center justify-end gap-2 text-sm text-slate-400 group-hover:text-slate-600 transition-colors">
                <span>{t("examples.clickToAnalyze")}</span>
                <svg
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 p-5 bg-slate-50 rounded-lg border border-slate-100 text-center">
          <p className="text-base text-slate-500">
            {t("examples.footerNote")}
          </p>
        </div>
      </div>
    </main>
  );
}
