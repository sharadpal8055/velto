import { useState } from "react";
import { ArrowLeft, Award, CheckCircle2, Download, LoaderCircle } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { jsPDF } from "jspdf";

const clampScore = (score, maximum) => {
  const numericScore = Number(score);
  return Number.isFinite(numericScore)
    ? Math.max(0, Math.min(maximum, numericScore))
    : 0;
};

const getPerformanceSummary = (scoreOutOfTen) => {
  if (scoreOutOfTen >= 8) {
    return {
      title: "Ready for job opportunities.",
      tagline: "Excellent clarity and structured responses.",
    };
  }
  if (scoreOutOfTen >= 5) {
    return {
      title: "Needs minor improvement before interviews.",
      tagline: "Good foundation; refine articulation.",
    };
  }
  return {
    title: "Significant improvement required.",
    tagline: "Work on clarity and confidence.",
  };
};

function Report({
  report,
  onRestart,
  actionLabel = "Start a new interview",
}) {
  const [pdfError, setPdfError] = useState("");

  if (!report) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F9FB] px-4">
        <p role="alert" className="text-sm text-red-700">
          Interview report is unavailable.
        </p>
      </main>
    );
  }

  const overallScore = clampScore(report.finalScore, 100);
  const overallScoreOutOfTen = overallScore / 10;
  const performance = getPerformanceSummary(overallScoreOutOfTen);
  const isCompleted = report.status === "completed";
  const questions = report.questionWiseScore || [];
  const scores = [
    { label: "Confidence", value: clampScore(report.confidence, 10) },
    { label: "Communication", value: clampScore(report.communication, 10) },
    { label: "Correctness", value: clampScore(report.correctness, 10) },
  ];
  const evaluatedQuestions = questions.filter(
    (question) => question.status === "evaluated" || isCompleted
  );
  const trendPoints = evaluatedQuestions.map((question) =>
    clampScore(question.score, 10)
  );

  const downloadPDF = () => {
    setPdfError("");

    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 44;
      const contentWidth = pageWidth - margin * 2;
      let y = 52;

      const ensureSpace = (height) => {
        if (y + height > pageHeight - margin) {
          doc.addPage();
          y = 52;
        }
      };

      const writeWrapped = (text, {
        size = 10,
        color = [55, 65, 81],
        bold = false,
        gap = 5,
      } = {}) => {
        const content = String(text || "—");
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setFontSize(size);
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(content, contentWidth);
        const lineHeight = size * 1.45;

        for (const line of lines) {
          ensureSpace(lineHeight + gap);
          doc.text(line, margin, y);
          y += lineHeight;
        }
        y += gap;
      };

      const writeSectionTitle = (title) => {
        ensureSpace(32);
        y += 7;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(31, 41, 55);
        doc.text(title, margin, y);
        y += 18;
      };

      doc.setFillColor(79, 70, 229);
      doc.roundedRect(margin, y, contentWidth, 74, 12, 12, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(19);
      doc.setTextColor(255, 255, 255);
      doc.text("VELTO Interview Performance Report", margin + 18, y + 30);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(
        `${report.role || "Interview"} · ${report.experience || ""} · ${report.mode || ""}`,
        margin + 18,
        y + 52
      );
      y += 94;

      writeWrapped(`Status: ${isCompleted ? "Completed" : "In progress"}`, {
        bold: true,
        color: isCompleted ? [5, 150, 105] : [180, 83, 9],
      });
      writeWrapped(
        `Overall score: ${overallScore.toFixed(1)}/100 (${overallScoreOutOfTen.toFixed(1)}/10)`,
        { size: 15, bold: true, color: [79, 70, 229] }
      );
      writeWrapped(performance.title, { size: 12, bold: true });
      writeWrapped(performance.tagline, { color: [107, 114, 128] });
      writeWrapped(
        `Questions evaluated: ${report.attemptedQuestions ?? evaluatedQuestions.length} of ${report.totalQuestions ?? questions.length}`
      );

      writeSectionTitle("Skill evaluation");
      scores.forEach(({ label, value }) => {
        writeWrapped(`${label}: ${value.toFixed(1)}/10`);
      });

      if (evaluatedQuestions.length) {
        writeSectionTitle("Performance trend");
        evaluatedQuestions.forEach((question, index) => {
          writeWrapped(
            `Question ${index + 1}: ${clampScore(question.score, 10).toFixed(1)}/10`
          );
        });
      }

      writeSectionTitle("Question-by-question feedback");
      questions.forEach((question, index) => {
        const evaluated = question.status === "evaluated" || isCompleted;
        ensureSpace(30);
        writeWrapped(`Question ${index + 1}${question.difficulty ? ` · ${question.difficulty}` : ""}`, {
          size: 11,
          bold: true,
          color: [55, 48, 163],
        });
        writeWrapped(question.question);
        if (evaluated) {
          writeWrapped(`Score: ${clampScore(question.score, 10).toFixed(1)}/10`, {
            bold: true,
          });
          writeWrapped(`Answer: ${question.answer || "No answer recorded."}`);
          writeWrapped(`Feedback: ${question.feedback || "No feedback provided."}`);
          writeWrapped(
            `Confidence ${clampScore(question.confidence, 10).toFixed(1)}/10 · Communication ${clampScore(question.communication, 10).toFixed(1)}/10 · Correctness ${clampScore(question.correctness, 10).toFixed(1)}/10`,
            { color: [107, 114, 128] }
          );
        } else {
          writeWrapped("Not evaluated yet.", { color: [107, 114, 128] });
        }
        y += 5;
      });

      const pageCount = doc.internal.getNumberOfPages();
      for (let page = 1; page <= pageCount; page += 1) {
        doc.setPage(page);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `VELTO · Interview report · Page ${page} of ${pageCount}`,
          pageWidth / 2,
          pageHeight - 22,
          { align: "center" }
        );
      }

      const filename = `velto-interview-report-${String(report.role || "interview")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "interview"}.pdf`;
      doc.save(filename);
    } catch (error) {
      console.error("Interview report PDF generation failed:", error);
      setPdfError("Could not generate the PDF. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F9FB] px-4 py-10 sm:px-6">
      <section className="mx-auto max-w-6xl rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Award size={28} />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-950">
            {isCompleted ? "Interview complete" : "Interview report"}
          </h1>
          <span
            className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              isCompleted
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {isCompleted ? "Completed" : "In progress"}
          </span>
          <p className="mt-2 text-sm text-gray-500">
            {report.role} · {report.experience} · {report.mode}
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-center text-sm font-medium text-gray-500">
              Overall performance
            </p>
            <div className="mx-auto mt-5 w-36">
              <CircularProgressbar
                value={overallScore}
                maxValue={100}
                text={`${Math.round(overallScore)}`}
                styles={buildStyles({
                  textColor: "#111827",
                  pathColor: "#10b981",
                  trailColor: "#e5e7eb",
                  textSize: "22px",
                })}
              />
            </div>
            <p className="mt-3 text-center text-sm text-gray-500">Out of 100</p>
            <p className="mt-5 text-center font-semibold text-gray-900">
              {performance.title}
            </p>
            <p className="mt-1 text-center text-sm text-gray-500">
              {performance.tagline}
            </p>
            <p className="mt-4 text-center text-sm text-gray-500">
              {report.attemptedQuestions ?? evaluatedQuestions.length} of{" "}
              {report.totalQuestions ?? questions.length} questions evaluated
            </p>
          </section>

          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">Performance trend</h2>
            {trendPoints.length ? (
              <>
                <div className="mt-5 h-52 w-full">
                  <svg
                    viewBox="0 0 600 210"
                    role="img"
                    aria-label="Question performance trend, scores out of ten"
                    className="h-full w-full overflow-visible"
                    preserveAspectRatio="none"
                  >
                    {[0, 5, 10].map((tick) => {
                      const y = 175 - tick * 14;
                      return (
                        <g key={tick}>
                          <line
                            x1="38"
                            x2="590"
                            y1={y}
                            y2={y}
                            stroke="#e5e7eb"
                            strokeDasharray="4 5"
                          />
                          <text
                            x="24"
                            y={y + 4}
                            textAnchor="end"
                            className="fill-gray-400 text-[11px]"
                          >
                            {tick}
                          </text>
                        </g>
                      );
                    })}
                    {trendPoints.length > 1 && (
                      <polyline
                        points={trendPoints
                          .map((score, index) => {
                            const x =
                              trendPoints.length === 1
                                ? 38
                                : 38 +
                                  (index * 552) / (trendPoints.length - 1);
                            const y = 175 - score * 14;
                            return `${x},${y}`;
                          })
                          .join(" ")}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                    {trendPoints.map((score, index) => {
                      const x =
                        trendPoints.length === 1
                          ? 314
                          : 38 + (index * 552) / (trendPoints.length - 1);
                      const y = 175 - score * 14;
                      return (
                        <g key={`${index}-${score}`}>
                          <circle cx={x} cy={y} r="5" fill="#10b981" />
                          <text
                            x={x}
                            y="198"
                            textAnchor="middle"
                            className="fill-gray-500 text-[11px]"
                          >
                            Q{index + 1}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
                <p className="mt-2 text-center text-xs text-gray-400">
                  Question scores out of 10
                </p>
              </>
            ) : (
              <p className="mt-6 rounded-xl bg-gray-50 p-5 text-sm text-gray-500">
                Score trend will appear when answers have been evaluated.
              </p>
            )}
          </section>
        </div>

        <section className="mt-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">Skill evaluation</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {scores.map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4"
              >
                <div className="w-16 shrink-0">
                  <CircularProgressbar
                    value={value}
                    maxValue={10}
                    text={`${value.toFixed(1)}`}
                    styles={buildStyles({
                      textColor: "#111827",
                      pathColor: "#10b981",
                      trailColor: "#e5e7eb",
                      textSize: "26px",
                    })}
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{label}</p>
                  <p className="mt-1 text-sm text-gray-500">Out of 10</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-5 text-center text-sm text-gray-500">
          {report.attemptedQuestions ?? evaluatedQuestions.length} of{" "}
          {report.totalQuestions ?? questions.length} questions completed
        </p>

        <section className="mt-9">
          <h2 className="text-lg font-bold text-gray-900">Question feedback</h2>
          <div className="mt-4 space-y-4">
            {questions.map((item, index) => {
              const isEvaluated = item.status === "evaluated" || isCompleted;
              return (
                <article
                  key={item.questionId || index}
                  className="rounded-2xl border border-gray-200 p-5"
                >
                  <div className="flex items-start gap-3">
                    {isEvaluated ? (
                      <CheckCircle2
                        size={19}
                        className="mt-0.5 shrink-0 text-emerald-600"
                      />
                    ) : (
                      <span className="mt-0.5 shrink-0 text-xs font-semibold text-amber-600">
                        Pending
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-gray-900">
                          Question {index + 1}
                        </p>
                        {isEvaluated && (
                          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                            {clampScore(item.score, 10)}/10
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-gray-700">
                        {item.question}
                      </p>
                      {isEvaluated ? (
                        <>
                          <p className="mt-3 text-xs font-semibold text-gray-500">
                            Your answer
                          </p>
                          <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                            {item.answer || "No answer recorded."}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
                            <span>
                              Confidence: {clampScore(item.confidence, 10)}/10
                            </span>
                            <span>
                              Communication: {clampScore(item.communication, 10)}/10
                            </span>
                            <span>
                              Correctness: {clampScore(item.correctness, 10)}/10
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-gray-600">
                            {item.feedback}
                          </p>
                        </>
                      ) : (
                        <p className="mt-3 text-sm text-gray-500">
                          This question has not been answered yet.
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {pdfError && (
          <p role="alert" className="mt-5 text-center text-sm text-red-600">
            {pdfError}
          </p>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={downloadPDF}
            className="flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            <Download size={17} />
            Download PDF report
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="flex items-center justify-center gap-2 rounded-full bg-gray-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            <ArrowLeft size={17} />
            {actionLabel}
          </button>
        </div>
      </section>
    </main>
  );
}

export default Report;
