import { useTranslation } from "react-i18next";
import { CHHANDAS } from "./utils/constant";
import SEO, { pageSEO } from "./components/SEO";

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white pt-20">
      <SEO {...pageSEO.about} />
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-normal text-slate-900 mb-2">
            {t("about.title")}
          </h1>
          <p className="text-slate-500">{t("about.subtitle")}</p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Description Section */}
          <section>
            <h2 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2 mb-4">
              {t("about.whatIsChhanda")}
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>{t("about.description1")}</p>
              <p>{t("about.description2")}</p>
            </div>
          </section>

          {/* Supported Chhandas Section */}
          <section>
            <h2 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2 mb-4">
              {t("about.supportedChhandas")}
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
                    {pattern.length
                      ? pattern.join(" ")
                      : t("about.specialRules")}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section>
            <h2 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2 mb-4">
              {t("about.features")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-slate-800 font-medium mb-1">
                  {t("about.syllableAnalysis")}
                </h3>
                <p className="text-slate-600 text-sm">
                  {t("about.syllableAnalysisDesc")}
                </p>
              </div>

              <div>
                <h3 className="text-slate-800 font-medium mb-1">
                  {t("about.ganaDetection")}
                </h3>
                <p className="text-slate-600 text-sm">
                  {t("about.ganaDetectionDesc")}
                </p>
              </div>

              <div>
                <h3 className="text-slate-800 font-medium mb-1">
                  {t("about.chhandaIdentification")}
                </h3>
                <p className="text-slate-600 text-sm">
                  {t("about.chhandaIdentificationDesc")}
                </p>
              </div>

              <div>
                <h3 className="text-slate-800 font-medium mb-1">
                  {t("about.instantResults")}
                </h3>
                <p className="text-slate-600 text-sm">
                  {t("about.instantResultsDesc")}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
      </div>
    </div>
  );
}
