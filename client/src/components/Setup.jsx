import { useRef, useState } from "react";
import { motion } from "motion/react";
import {
  UserRound,
  BriefcaseBusiness,
  Mic,
  ChartNoAxesCombined,
  Upload,
  FileText,
  X,
  ArrowRight,
  LoaderCircle,
  Sparkles,
  FolderKanban,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";

function Step1SetUp({ onStart }) {
  const fileInputRef = useRef(null);
  const { userdata } = useSelector((state) => state.user);
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");
  const [resume, setResume] = useState(null);
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8055";

  const features = [
    { icon: UserRound, title: "Choose Role & Experience" },
    { icon: Mic, title: "Smart Voice Interview" },
    { icon: ChartNoAxesCombined, title: "Performance Analytics" },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF resume.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume must be smaller than 5 MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setResume(file);
    setResumeAnalysis(null);
  };

  const removeResume = () => {
    setResume(null);
    setResumeAnalysis(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAnalyzeResume = async () => {
    if (!resume) {
      setError("Please upload your resume first.");
      return;
    }

    setError("");
    setAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("resume", resume);

      const response = await axios.post(
        `${API_URL}/api/resume/analyze`,
        formData,
        {
          withCredentials: true,
        },
      );

      const { analysis, resumeText } = response.data?.data || {};

      if (
        !analysis ||
        typeof analysis !== "object" ||
        Array.isArray(analysis) ||
        typeof resumeText !== "string"
      ) {
        throw new Error("Invalid resume analysis received from server.");
      }

      setResumeAnalysis({ ...analysis, resumeText });
    } catch (err) {
      console.error("Resume analysis error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to analyze your resume. Please try again.",
      );
    } finally {
      setAnalyzing(false);
    }
  };

const handleStart = async (e) => {
  e.preventDefault();
  setError("");

  if (!role.trim() || !experience.trim()) {
    setError("Please enter your target role and experience.");
    return;
  }

  if (!userdata) {
    setError("Please log in before starting an interview.");
    return;
  }

  if ((userdata.credit ?? 0) < 50) {
    setError("You need at least 50 credits to start an interview.");
    return;
  }

  if (resume && !resumeAnalysis) {
    setError("Please analyze your resume before starting the interview.");
    return;
  }

  setStarting(true);

  try {
    const interviewData = {
      role: role.trim(),
      experience: experience.trim(),
      mode,
      resumeAnalysis: resumeAnalysis || null,
      resumeText: resumeAnalysis?.resumeText || "",
    };

    if (typeof onStart !== "function") {
      throw new Error("Interview start handler is not configured.");
    }

    await onStart(interviewData);
  } catch (err) {
    console.error("Start interview error:", err);

    setError(
      err.response?.data?.message ||
        err.message ||
        "Could not start the interview. Please try again."
    );
  } finally {
    setStarting(false);
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F9FB] px-4 py-8 sm:px-6 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] md:grid-cols-2"
      >
        {/* LEFT PANEL */}
        <div className="flex flex-col justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-7 py-10 sm:px-10 md:px-12 md:py-14">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-indigo-700">
              <Sparkles size={13} />
              AI POWERED INTERVIEW PLATFORM
            </div>

            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-950 sm:text-4xl">
              Start Your AI Interview
            </h1>

            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-600 sm:text-base">
              Practice real interview scenarios powered by AI. Improve your
              communication, technical skills, and confidence.
            </p>

            <div className="mt-9 space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.12 }}
                    className="flex items-center gap-4 rounded-xl border border-white bg-white/90 px-4 py-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <Icon size={21} />
                    </div>

                    <span className="text-sm font-semibold text-gray-700 sm:text-base">
                      {feature.title}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-10 flex items-center gap-3 text-[10px] font-semibold tracking-[0.12em] text-gray-500">
              <div className="h-px flex-1 bg-indigo-200" />
              <span>YOUR NEXT OPPORTUNITY STARTS HERE</span>
              <div className="h-px flex-1 bg-indigo-200" />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col justify-center px-7 py-9 sm:px-10 md:px-12 md:py-12">
          <div className="mb-7">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <BriefcaseBusiness size={21} />
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-gray-950">
              Interview Setup
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Customize your interview before getting started.
            </p>
          </div>

          <form onSubmit={handleStart} className="space-y-5">
            {/* ROLE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Target Role
              </label>

              <div className="relative">
                <UserRound
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Full Stack Developer"
                  className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            {/* EXPERIENCE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Experience
              </label>

              <div className="relative">
                <BriefcaseBusiness
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g. Fresher, 2 years"
                  className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            {/* INTERVIEW MODE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Interview Type
              </label>

              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              >
                <option value="Technical">Technical Interview</option>
                <option value="HR">HR Interview</option>
              </select>
            </div>

            {/* RESUME UPLOAD */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Upload Resume{" "}
                <span className="font-normal text-gray-400">(Optional)</span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              {!resume ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex min-h-[125px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 transition hover:border-indigo-400 hover:bg-indigo-50/50"
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <Upload size={22} />
                  </div>

                  <span className="text-sm font-semibold text-gray-700">
                    Click to upload resume
                  </span>

                  <span className="mt-1 text-xs text-gray-400">
                    PDF format · Maximum 5 MB
                  </span>
                </button>
              ) : (
                <div className="flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50/60 p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600">
                      <FileText size={21} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {resume.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(resume.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={removeResume}
                    disabled={analyzing}
                    className="ml-2 rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                    aria-label="Remove resume"
                  >
                    <X size={19} />
                  </button>
                </div>
              )}

              {/* ANALYZE RESUME BUTTON */}
              {resume && (
                <button
                  type="button"
                  onClick={handleAnalyzeResume}
                  disabled={analyzing}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {analyzing ? (
                    <>
                      <LoaderCircle size={17} className="animate-spin" />
                      Analyzing Resume...
                    </>
                  ) : (
                    <>
                      <Sparkles size={17} />
                      {resumeAnalysis ? "Analyze Again" : "Analyze Resume"}
                    </>
                  )}
                </button>
              )}
            </div>

            {/* RESUME ANALYSIS RESULT */}
            {resumeAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-h-[340px] space-y-4 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-indigo-600" />
                    <h3 className="text-sm font-bold text-gray-900">
                      Resume Analysis Result
                    </h3>
                  </div>

                  <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-semibold text-indigo-700">
                    Analyzed
                  </span>
                </div>

                {resumeAnalysis.summary && (
                  <p className="text-xs leading-5 text-gray-600">
                    {resumeAnalysis.summary}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-gray-200 bg-white p-3">
                    <p className="text-xs text-gray-500">Resume Score</p>
                    <p className="mt-1 text-xl font-bold text-gray-900">
                      {resumeAnalysis.overallScore ?? 0}
                      <span className="text-xs font-medium text-gray-400">
                        /100
                      </span>
                    </p>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-white p-3">
                    <p className="text-xs text-gray-500">ATS Score</p>
                    <p className="mt-1 text-xl font-bold text-gray-900">
                      {resumeAnalysis.atsScore ?? 0}
                      <span className="text-xs font-medium text-gray-400">
                        /100
                      </span>
                    </p>
                  </div>
                </div>

                {/* SKILLS */}
                <div>
                  <p className="mb-2 flex items-center gap-2 text-xs font-bold text-gray-800">
                    <Sparkles size={14} className="text-indigo-600" />
                    Extracted Skills ({resumeAnalysis.skills?.length || 0})
                  </p>

                  {resumeAnalysis.skills?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {resumeAnalysis.skills.map((skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">
                      No skills were identified.
                    </p>
                  )}
                </div>

                {/* PROJECTS */}
                <div>
                  <p className="mb-2 flex items-center gap-2 text-xs font-bold text-gray-800">
                    <FolderKanban size={14} className="text-indigo-600" />
                    Projects ({resumeAnalysis.projects?.length || 0})
                  </p>

                  {resumeAnalysis.projects?.length > 0 ? (
                    <div className="space-y-3">
                      {resumeAnalysis.projects.map((project, index) => (
                        <div
                          key={`${project.name}-${index}`}
                          className="rounded-lg border border-gray-200 bg-white p-3"
                        >
                          <h4 className="text-xs font-bold text-gray-900">
                            {project.name}
                          </h4>

                          {project.description && (
                            <p className="mt-1 text-xs leading-5 text-gray-500">
                              {project.description}
                            </p>
                          )}

                          {project.technologies?.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {project.technologies.map((tech, techIndex) => (
                                <span
                                  key={`${tech}-${techIndex}`}
                                  className="rounded-md bg-gray-100 px-2 py-1 text-[10px] text-gray-600"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}

                          {project.interviewTopics?.length > 0 && (
                            <p className="mt-2 text-[11px] leading-5 text-gray-500">
                              <span className="font-semibold text-gray-700">
                                Interview topics:{" "}
                              </span>
                              {project.interviewTopics.join(", ")}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">
                      No projects were identified.
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* ERROR */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                <AlertCircle size={17} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}

            {/* START INTERVIEW */}
            <button
              type="submit"
              disabled={starting || analyzing}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-gray-950 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-gray-900/10 transition-all duration-300 hover:bg-indigo-600 hover:shadow-indigo-600/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {starting ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Starting Interview...
                </>
              ) : (
                <>
                  Start Interview
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>

            <p className="text-center text-xs leading-5 text-gray-400">
              {resume
                ? "Your projects and skills will be used to personalize your interview."
                : "Upload a resume to enable project-based and skill-based questions."}
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default Step1SetUp;
