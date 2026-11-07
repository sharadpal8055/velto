import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowRight, Clock3, FileText, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8055";

const formatDate = (date) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const loadHistory = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/resume/my-interviews`,
          { withCredentials: true }
        );

        if (active) {
          setInterviews(response.data?.data || []);
        }
      } catch (requestError) {
        console.error("Interview history request failed:", requestError);
        if (active) {
          setError(
            requestError.response?.data?.message ||
              "Unable to load your interview history."
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadHistory();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#F8F9FB] pb-12">
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 pt-10 sm:px-6">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600">
            Your progress
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Interview history
          </h1>
          <p className="mt-2 text-gray-600">
            Review your interview status, scores, and answer feedback.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-3 rounded-3xl border border-gray-200 bg-white p-12 text-gray-600">
            <LoaderCircle className="animate-spin" size={20} />
            Loading interview history...
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
          >
            {error}
          </div>
        ) : interviews.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-14 text-center">
            <FileText className="mx-auto text-gray-400" size={34} />
            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              No interviews yet
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Your completed and in-progress interviews will appear here.
            </p>
            <button
              type="button"
              onClick={() => navigate("/interviews")}
              className="mt-6 rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-600"
            >
              Start an interview
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {interviews.map((interview) => {
              const isCompleted = interview.status === "completed";
              return (
                <button
                  type="button"
                  key={interview._id}
                  onClick={() =>
                    navigate(`/interviews/${interview._id}/report`)
                  }
                  className="group w-full rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-gray-950">
                        {interview.role}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {interview.experience} · {interview.mode}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        isCompleted
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {isCompleted ? "Completed" : "In progress"}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">
                      Score: {interview.finalScore ?? 0}/100
                    </span>
                    <span>
                      {interview.attemptedQuestions ?? 0} of{" "}
                      {interview.totalQuestions ?? 0} questions evaluated
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 size={15} />
                      {formatDate(interview.createdAt)}
                    </span>
                    <span className="ml-auto inline-flex items-center gap-1 font-semibold text-indigo-600 group-hover:gap-2">
                      View report <ArrowRight size={16} />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default InterviewHistory;