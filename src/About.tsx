import { CHHANDAS } from "./utils/constant";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-24">
      <div className="container max-w-4xl mx-auto px-6 py-16 ">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-3 tracking-tight">
            छन्दको परिचय
          </h1>
          <p className="text-slate-500 text-lg font-light">
            छन्द शास्त्रको आधारभूत जानकारी
          </p>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto mt-6"></div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Description Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <h2 className="text-2xl font-light text-slate-800">
                  छन्द के हो?
                </h2>
              </div>

              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                  छन्द संस्कृत कविताको मेट्रिकल ढाँचा हो। यसले श्लोकको ताल,
                  अक्षर संख्या र संरचना निर्धारण गर्छ, जसले शास्त्रीय साहित्यको
                  सौन्दर्य र अर्थमा महत्वपूर्ण भूमिका खेल्छ। यो एप्लिकेसनले
                  तपाइँका श्लोकहरूमा विभिन्न छन्दहरू जाँच र विश्लेषण गर्न मद्दत
                  गर्छ।
                </p>

                <p className="text-slate-600 text-lg leading-relaxed">
                  छन्दशास्त्र प्राचीन नेपाली साहित्यको एक महत्वपूर्ण अंग हो जसले
                  कविताको संरचना र लयलाई व्यवस्थित बनाउँछ। यसले काव्यको सौन्दर्य
                  बढाउने र स्मरणीय बनाउने काम गर्छ।
                </p>
              </div>
            </div>
          </div>

          {/* Supported Chhandas Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <h2 className="text-2xl font-light text-slate-800">
                  यस एप्लिकेसनले जाँच गर्न सक्ने छन्दहरू
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(CHHANDAS).map(([name, pattern], index) => (
                  <div
                    key={name}
                    className="group bg-gradient-to-r from-white to-slate-50/50 border border-slate-200/60 rounded-xl p-6 hover:shadow-lg hover:border-slate-300/80 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-200">
                        <span className="text-blue-800 font-semibold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <h3 className="text-slate-800 font-semibold text-lg tracking-tight">
                        {name}
                      </h3>
                    </div>

                    <div className="bg-slate-50/80 rounded-lg p-4 border border-slate-100">
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                        गण अनुक्रम (Pattern)
                      </div>
                      <div className="text-slate-700 font-mono text-sm leading-relaxed">
                        {pattern.length ? pattern.join(" • ") : "विशेष नियम"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <h2 className="text-2xl font-light text-slate-800">विशेषताहरू</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-slate-800 font-medium mb-2">
                    अक्षर विश्लेषण
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    नेपाली पाठको अक्षरहरूलाई स्वचालित रूपमा पहिचान र विभाजन
                    गर्दछ।
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-slate-800 font-medium mb-2">
                    गण निर्धारण
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    अक्षरहरूबाट गणहरू बनाउँछ र छन्दको ढाँचा पहिचान गर्छ।
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-slate-800 font-medium mb-2">
                    छन्द पहिचान
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    श्लोकको छन्द प्रकार स्वचालित रूपमा पहिचान गर्दछ।
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-slate-800 font-medium mb-2">
                    तत्काल परिणाम
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    द्रुत र सटिक विश्लेषण प्रदान गर्दछ।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto mt-6"></div>
          <p className="text-lg font-light text-slate-800 mb-3 mt-6">
            Designed by{" "}
            <a
              href="https://www.linkedin.com/in/aavashbaral/"
              className="text-black tracking-tight decoration-1 decoration-black/40 underline underline-offset-4"
              style={{
                textUnderlineOffset: 4,
                color: "#1e293b",
                textDecoration: "underline",
              }}
            >
              आभाष बराल
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
