import { ArrowLeft, Award, CheckCircle2 } from "lucide-react";

function Report({ report, onRestart }) {
  if (!report) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F9FB] px-4">
        <p role="alert" className="text-sm text-red-700">
          Interview report is unavailable.
        </p>
      </main>
    );
  }

  const scores = [
    ["Confidence", report.confidence],
    ["Communication", report.communication],
    ["Correctness", report.correctness],
  ];

  return (
    <main className="min-h-screen bg-[#F8F9FB] px-4 py-10 sm:px-6">
      <section className="mx-auto max-w-4xl rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Award size={28} />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-950">
            Interview complete
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {report.role} · {report.experience} · {report.mode}
          </p>
          <p className="mt-6 text-5xl font-bold text-indigo-600">
            {report.finalScore ?? 0}
            <span className="text-lg font-medium text-gray-400">/100</span>
          </p>
          <p className="mt-2 text-sm text-gray-500">Overall score</p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {scores.map(([label, score]) => (
            <div
              key={label}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center"
            >
              <p className="text-sm text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {score ?? 0}
                <span className="text-sm font-medium text-gray-400">/10</span>
              </p>
            </div>
          ))}
        </div>

        <p className="mt-5 text-center text-sm text-gray-500">
          {report.attemptedQuestions ?? 0} of {report.totalQuestions ?? 0}{" "}
          questions completed
        </p>

        <div className="mt-9">
          <h2 className="text-lg font-bold text-gray-900">Question feedback</h2>
          <div className="mt-4 space-y-4">
            {(report.questionWiseScore || []).map((item, index) => (
              <article
                key={item.questionId || index}
                className="rounded-2xl border border-gray-200 p-5"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-gray-900">
                        Question {index + 1}
                      </p>
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                        {item.score ?? 0}/10
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-gray-700">
                      {item.question}
                    </p>
                    <p className="mt-3 text-xs font-semibold text-gray-500">
                      Your answer
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                      {item.answer}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      {item.feedback}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="mx-auto mt-8 flex items-center justify-center gap-2 rounded-full bg-gray-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
        >
          <ArrowLeft size={17} />
          Start a new interview
        </button>
      </section>
    </main>
  );
}

export default Report;
