import { useEffect, useState } from "react";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Report from "../components/Report";
import { API_URL } from "../config/api";

const InterviewReport = () => {
  const { interviewId } = useParams();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const loadReport = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `${API_URL}/api/resume/interviews/${interviewId}/report`,
          { withCredentials: true }
        );
        if (active) setReport(response.data?.data || null);
      } catch (requestError) {
        console.error("Interview report request failed:", requestError);
        if (active) {
          setError(
            requestError.response?.data?.message ||
              "Unable to load this interview report."
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadReport();
    return () => {
      active = false;
    };
  }, [interviewId]);

  return (
    <main className="min-h-screen bg-[#F8F9FB] pb-10">
      <Navbar />
      {isLoading ? (
        <div className="flex min-h-[60vh] items-center justify-center gap-3 text-gray-600">
          <LoaderCircle className="animate-spin" size={20} />
          Loading report...
        </div>
      ) : error ? (
        <section className="mx-auto mt-12 max-w-3xl px-4">
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
          >
            {error}
          </div>
          <button
            type="button"
            onClick={() => navigate("/history")}
            className="mt-5 rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-600"
          >
            Back to interview history
          </button>
        </section>
      ) : (
        <Report
          report={report}
          onRestart={() => navigate("/history")}
          actionLabel="Back to interview history"
        />
      )}
    </main>
  );
};

export default InterviewReport;
