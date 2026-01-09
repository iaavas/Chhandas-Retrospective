import React from "react";
import { GANAS, CHHANDAS } from "./utils/constant";
import SEO, { pageSEO } from "./components/SEO";

type QuizQuestion = {
  id: number;
  type: "chhanda-name" | "gana-pattern" | "gana-name" | "pattern-match";
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
};

function ChhandaQuiz() {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState("");
  const [showResult, setShowResult] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [quizCompleted, setQuizCompleted] = React.useState(false);
  const [questions, setQuestions] = React.useState<QuizQuestion[]>([]);
  const [quizStarted, setQuizStarted] = React.useState(false);
  const [quizType, setQuizType] = React.useState<
    "mixed" | "chhanda-only" | "gana-only"
  >("mixed");
  const [questionCount, setQuestionCount] = React.useState(10);

  const generateQuestions = () => {
    const newQuestions: QuizQuestion[] = [];
    const chhandaNames = Object.keys(CHHANDAS);
    const ganaNames = Object.keys(GANAS);
    const ganaValues = Object.values(GANAS);

    for (let i = 0; i < questionCount; i++) {
      const questionType =
        quizType === "mixed"
          ? ["chhanda-name", "gana-pattern", "gana-name", "pattern-match"][
              Math.floor(Math.random() * 4)
            ]
          : quizType === "chhanda-only"
          ? ["chhanda-name", "pattern-match"][Math.floor(Math.random() * 2)]
          : ["gana-pattern", "gana-name"][Math.floor(Math.random() * 2)];

      let question: QuizQuestion;

      switch (questionType) {
        case "chhanda-name":
          const randomChhanda =
            chhandaNames[Math.floor(Math.random() * chhandaNames.length)];
          const chhandaPattern = CHHANDAS[randomChhanda];
          const wrongChhandas = chhandaNames
            .filter((name) => name !== randomChhanda)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

          question = {
            id: i,
            type: "chhanda-name",
            question: `यो गण प्याटर्न कुन छन्द हो? ${chhandaPattern.join(" ")}`,
            options: [randomChhanda, ...wrongChhandas].sort(
              () => 0.5 - Math.random()
            ),
            correctAnswer: randomChhanda,
            explanation: `${randomChhanda} छन्दको गण प्याटर्न: ${chhandaPattern.join(
              " "
            )}`,
          };
          break;

        case "gana-pattern":
          const randomGana =
            ganaNames[Math.floor(Math.random() * ganaNames.length)];
          const ganaName = GANAS[randomGana];
          const wrongGanas = ganaNames
            .filter((gana) => gana !== randomGana)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

          question = {
            id: i,
            type: "gana-pattern",
            question: `"${ganaName}" को गण कोड के हो?`,
            options: [randomGana, ...wrongGanas].sort(
              () => 0.5 - Math.random()
            ),
            correctAnswer: randomGana,
            explanation: `${ganaName} को गण कोड: ${randomGana}`,
          };
          break;

        case "gana-name":
          const randomGanaCode =
            ganaNames[Math.floor(Math.random() * ganaNames.length)];
          const correctGanaName = GANAS[randomGanaCode];
          const wrongGanaNames = ganaValues
            .filter((name) => name !== correctGanaName)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

          question = {
            id: i,
            type: "gana-name",
            question: `"${randomGanaCode}" को गण नाम के हो?`,
            options: [correctGanaName, ...wrongGanaNames].sort(
              () => 0.5 - Math.random()
            ),
            correctAnswer: correctGanaName,
            explanation: `${randomGanaCode} को गण नाम: ${correctGanaName}`,
          };
          break;

        case "pattern-match":
          const randomChhanda2 =
            chhandaNames[Math.floor(Math.random() * chhandaNames.length)];
          const chhandaPattern2 = CHHANDAS[randomChhanda2];
          const wrongPatterns = chhandaNames
            .filter((name) => name !== randomChhanda2)
            .map((name) => CHHANDAS[name])
            .filter((pattern) => pattern.length > 0)
            .sort(() => 0.5 - Math.random())
            .slice(0, 2);

          const allPatterns = [chhandaPattern2, ...wrongPatterns].sort(
            () => 0.5 - Math.random()
          );

          question = {
            id: i,
            type: "pattern-match",
            question: `"${randomChhanda2}" छन्दको सही गण प्याटर्न कुन हो?`,
            options: allPatterns.map((pattern) => pattern.join(" ")),
            correctAnswer: chhandaPattern2.join(" "),
            explanation: `${randomChhanda2} छन्दको गण प्याटर्न: ${chhandaPattern2.join(
              " "
            )}`,
          };
          break;

        default:
          continue;
      }

      newQuestions.push(question);
    }

    setQuestions(newQuestions);
  };

  const startQuiz = () => {
    generateQuestions();
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setQuizCompleted(false);
    setSelectedAnswer("");
    setShowResult(false);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const isCorrect =
      selectedAnswer === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setQuizCompleted(false);
    setSelectedAnswer("");
    setShowResult(false);
    setQuestions([]);
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90)
      return "उत्कृष्ट! तपाईंले छन्दहरू राम्ररी बुझ्नुभएको छ।";
    if (percentage >= 80) return "राम्रो! तपाईंको ज्ञान अझै बढाउन सकिन्छ।";
    if (percentage >= 60) return "ठीक छ। अभ्यास गर्नुहोस् र अझै सिक्नुहोस्।";
    return "अभ्यास आवश्यक छ। फेरि प्रयास गर्नुहोस्।";
  };

  if (!quizStarted) {
    return (
      <main className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-24">
        <SEO {...pageSEO.quiz} />
        <div className="container max-w-4xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-3 tracking-tight">
              छन्द सिकाइ क्विज
            </h1>
            <p className="text-slate-500 text-lg font-light">
              आफ्नो छन्द ज्ञान परीक्षण गर्नुहोस्
            </p>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto mt-6"></div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-slate-700 font-medium mb-3">
                  क्विज प्रकार:
                </label>
                <select
                  value={quizType}
                  onChange={(e) => setQuizType(e.target.value as any)}
                  className="w-full p-4 bg-slate-50/50 border-0 rounded-xl text-slate-700 text-lg focus:outline-none focus:ring-2 focus:ring-slate-300/50 focus:bg-white/80 transition-all duration-200"
                >
                  <option value="mixed">मिश्रित (सबै प्रकार)</option>
                  <option value="chhanda-only">छन्द मात्र</option>
                  <option value="gana-only">गण मात्र</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-3">
                  प्रश्नको संख्या:
                </label>
                <input
                  type="number"
                  min="5"
                  max="20"
                  value={questionCount}
                  onChange={(e) =>
                    setQuestionCount(parseInt(e.target.value) || 10)
                  }
                  className="w-full p-4 bg-slate-50/50 border-0 rounded-xl text-slate-700 text-lg focus:outline-none focus:ring-2 focus:ring-slate-300/50 focus:bg-white/80 transition-all duration-200"
                />
              </div>

              <div className="text-center">
                <button
                  onClick={startQuiz}
                  className="px-8 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 hover:shadow-lg shadow-slate-900/25 transition-all duration-200"
                >
                  क्विज सुरु गर्नुहोस्
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (quizCompleted) {
    const percentage = (score / questions.length) * 100;
    return (
      <main className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-24">
        <SEO {...pageSEO.quiz} />
        <div className="container max-w-4xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-3 tracking-tight">
              क्विज सम्पन्न!
            </h1>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-8 mb-8">
              <div className="space-y-6">
                <div className="text-center">
                  <div
                    className={`text-6xl font-bold mb-4 ${getScoreColor(
                      percentage
                    )}`}
                  >
                    {percentage.toFixed(1)}%
                  </div>
                  <div className="text-xl text-slate-700 mb-4">
                    {score} / {questions.length} सही
                  </div>
                  <div className="text-lg text-slate-600">
                    {getScoreMessage(percentage)}
                  </div>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-1000 ${
                      percentage >= 80
                        ? "bg-green-500"
                        : percentage >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={resetQuiz}
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 hover:shadow-lg shadow-slate-900/25 transition-all duration-200"
                  >
                    फेरि प्रयास गर्नुहोस्
                  </button>
                  <button
                    onClick={() => {
                      resetQuiz();
                      setQuizStarted(false);
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 hover:shadow-lg shadow-blue-600/25 transition-all duration-200"
                  >
                    नयाँ क्विज
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-24">
      <SEO {...pageSEO.quiz} />
      <div className="container max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-3 tracking-tight">
            छन्द क्विज
          </h1>
          <div className="flex justify-center items-center gap-4 text-slate-600">
            <span>
              प्रश्न {currentQuestion + 1} / {questions.length}
            </span>
            <span>•</span>
            <span>स्कोर: {score}</span>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/20 p-8">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                {currentQ.question}
              </h2>
            </div>

            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showResult && handleAnswerSelect(option)}
                  disabled={showResult}
                  className={`w-full p-4 text-left rounded-xl font-medium transition-all duration-200 ${
                    showResult
                      ? option === currentQ.correctAnswer
                        ? "bg-green-100 text-green-800 border-2 border-green-300"
                        : option === selectedAnswer
                        ? "bg-red-100 text-red-800 border-2 border-red-300"
                        : "bg-slate-50 text-slate-600"
                      : selectedAnswer === option
                      ? "bg-slate-200 text-slate-800 border-2 border-slate-400"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <span className="font-bold mr-3">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </button>
              ))}
            </div>

            {showResult && (
              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-center">
                  <div
                    className={`text-lg font-semibold mb-2 ${
                      selectedAnswer === currentQ.correctAnswer
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {selectedAnswer === currentQ.correctAnswer
                      ? "सही!"
                      : "गलत!"}
                  </div>
                  {currentQ.explanation && (
                    <div className="text-slate-600">{currentQ.explanation}</div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-center">
              {!showResult ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    !selectedAnswer
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg shadow-slate-900/25"
                  }`}
                >
                  जवाफ दिनुहोस्
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 hover:shadow-lg shadow-blue-600/25 transition-all duration-200"
                >
                  {currentQuestion < questions.length - 1
                    ? "अर्को प्रश्न"
                    : "परिणाम हेर्नुहोस्"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ChhandaQuiz;
