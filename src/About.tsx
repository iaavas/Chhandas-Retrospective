const chhandasList = [
  "Anushtubh",
  "Gayatri",
  "Trishtubh",
  "Jagati",
  "Pankti",
  "Ushnik",
  "Brihati",
  "SatoBrihati",
  "Atijagati",
  "Atisankriti",
  "DvipadaViraj",
  "Viraj",
];

const chhandasDescriptions: Record<string, string> = {
  Anushtubh: "32 मात्रा, 8-8 अक्षरको 4 पाद",
  Gayatri: "24 मात्रा, 8-8 अक्षरको 3 पाद",
  Trishtubh: "44 मात्रा, 11-11 अक्षरको 4 पाद",
  Jagati: "48 मात्रा, 12-12 अक्षरको 4 पाद",
  Pankti: "40 मात्रा, 10-10 अक्षरको 4 पाद",
  Ushnik: "28 मात्रा, 7-7 अक्षरको 4 पाद",
};

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100  pt-24">
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
                  कविताको छन्दोबद्धता र लयबद्धतालाई व्यवस्थित गर्दछ।
                </p>
              </div>
            </div>
          </div>

          {/* Supported Chhandas Grid */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <h2 className="text-2xl font-light text-slate-800">
                समर्थित छन्दहरू
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chhandasList.map((chhanda, index) => (
                <div
                  key={chhanda}
                  className="group p-4 bg-slate-50/50 hover:bg-white/80 rounded-xl border border-slate-200/30 hover:border-slate-300/50 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-200">
                      <span className="text-purple-800 font-semibold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="text-slate-800 font-medium text-lg">
                      {chhanda}
                    </h3>
                  </div>

                  {chhandasDescriptions[chhanda] && (
                    <p className="text-slate-500 text-sm leading-relaxed pl-11">
                      {chhandasDescriptions[chhanda]}
                    </p>
                  )}
                </div>
              ))}
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
