import { CHHANDAS } from "./utils/constant";
import SEO, { pageSEO } from "./components/SEO";

export default function About() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <SEO {...pageSEO.about} />
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-normal text-slate-900 mb-2">
            छन्दको परिचय
          </h1>
          <p className="text-slate-500">छन्द शास्त्रको आधारभूत जानकारी</p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Description Section */}
          <section>
            <h2 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2 mb-4">
              छन्द के हो?
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                छन्द संस्कृत कविताको मेट्रिकल ढाँचा हो। यसले श्लोकको ताल, अक्षर
                संख्या र संरचना निर्धारण गर्छ, जसले शास्त्रीय साहित्यको सौन्दर्य
                र अर्थमा महत्वपूर्ण भूमिका खेल्छ। यो एप्लिकेसनले तपाइँका
                श्लोकहरूमा विभिन्न छन्दहरू जाँच र विश्लेषण गर्न मद्दत गर्छ।
              </p>
              <p>
                छन्दशास्त्र प्राचीन नेपाली साहित्यको एक महत्वपूर्ण अंग हो जसले
                कविताको संरचना र लयलाई व्यवस्थित बनाउँछ। यसले काव्यको सौन्दर्य
                बढाउने र स्मरणीय बनाउने काम गर्छ।
              </p>
            </div>
          </section>

          {/* Supported Chhandas Section */}
          <section>
            <h2 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2 mb-4">
              यस एप्लिकेसनले जाँच गर्न सक्ने छन्दहरू
            </h2>
            <div className="space-y-4">
              {Object.entries(CHHANDAS).map(([name, pattern], index) => (
                <div
                  key={name}
                  className="flex justify-between items-start py-3 border-b border-slate-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-sm w-6">
                      {index + 1}.
                    </span>
                    <span className="text-slate-800 font-medium">{name}</span>
                  </div>
                  <span className="text-slate-500 font-mono text-sm">
                    {pattern.length ? pattern.join(" ") : "विशेष नियम"}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section>
            <h2 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2 mb-4">
              विशेषताहरू
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-slate-800 font-medium mb-1">
                  अक्षर विश्लेषण
                </h3>
                <p className="text-slate-600 text-sm">
                  नेपाली पाठको अक्षरहरूलाई स्वचालित रूपमा पहिचान र विभाजन गर्दछ।
                </p>
              </div>

              <div>
                <h3 className="text-slate-800 font-medium mb-1">गण निर्धारण</h3>
                <p className="text-slate-600 text-sm">
                  अक्षरहरूबाट गणहरू बनाउँछ र छन्दको ढाँचा पहिचान गर्छ।
                </p>
              </div>

              <div>
                <h3 className="text-slate-800 font-medium mb-1">छन्द पहिचान</h3>
                <p className="text-slate-600 text-sm">
                  श्लोकको छन्द प्रकार स्वचालित रूपमा पहिचान गर्दछ।
                </p>
              </div>

              <div>
                <h3 className="text-slate-800 font-medium mb-1">
                  तत्काल परिणाम
                </h3>
                <p className="text-slate-600 text-sm">
                  द्रुत र सटिक विश्लेषण प्रदान गर्दछ।
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-slate-200 text-center text-slate-500 text-sm">
          Designed by{" "}
          <a
            href="https://www.linkedin.com/in/aavashbaral/"
            className="text-slate-700 underline underline-offset-2"
          >
            आभाष बराल
          </a>
        </footer>
      </div>
    </div>
  );
}
