import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Clock3,
  CheckCircle2,
  LoaderCircle,
  UserRound,
  Bot,
  AlertCircle,
} from "lucide-react";

import femaleVideo from "../assets/female-ai.mp4";
import maleVideo from "../assets/male-ai.mp4";
import Timer from "./Timer";
import { API_URL } from "../config/api";

const Step2Interview = ({ interviewdata, onFinish }) => {
  const {
    interviewId,
    questions = [],
    role = "Software Developer",
    userName = "Candidate",
    mode = "Technical",
  } = interviewdata || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(
    questions[0]?.timeLimit || 60
  );

  const [isMicOn, setIsMicOn] = useState(false);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [readyQuestionIndex, setReadyQuestionIndex] = useState(-1);
  const [isIntroEnded, setIsIntroEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [selectedVoice, setSelectedVoice] = useState(() => {
    if (!("speechSynthesis" in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    const englishVoices = voices.filter((voice) =>
      voice.lang.toLowerCase().startsWith("en")
    );
    return (
      englishVoices.find((voice) =>
        /\b(female|woman|zira|susan|samantha|karen|aria)\b/i.test(voice.name)
      ) ||
      englishVoices[0] ||
      voices[0] ||
      null
    );
  });
  const [subtitle, setSubtitle] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState("");

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const submitLockRef = useRef(false);
  const introStartedRef = useRef(false);
  const speakTextRef = useRef(null);
  const submitAnswerRef = useRef(null);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const isQuestionReady = readyQuestionIndex === currentIndex;

  const videoSource =
    voiceGender === "female" ? femaleVideo : maleVideo;

  // ------------------------------------------
  // Load a suitable browser speech voice
  // ------------------------------------------

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();

      if (!voices.length) return;

      const englishVoices = voices.filter((voice) =>
        voice.lang.toLowerCase().startsWith("en")
      );
      const genderPattern =
        voiceGender === "male"
          ? /\b(male|man|david|mark|daniel|james|guy)\b/i
          : /\b(female|woman|zira|susan|samantha|karen|aria)\b/i;
      const preferredVoice =
        englishVoices.find((voice) => genderPattern.test(voice.name)) ||
        englishVoices[0];

      setSelectedVoice(preferredVoice || voices[0]);
    };

    loadVoices();

    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (window.speechSynthesis.onvoiceschanged === loadVoices) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [voiceGender]);

  // ------------------------------------------
  // Stop microphone and speech safely
  // ------------------------------------------

  const stopMicrophone = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      // Recognition may already be stopped.
    }

    recognitionRef.current = null;
    setIsMicOn(false);
  }, []);

  const stopSpeech = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    setIsAIPlaying(false);
    setSubtitle("");
  }, []);

  // ------------------------------------------
  // AI speech function
  // ------------------------------------------

  const speakText = useCallback(
    (text) => {
      return new Promise((resolve) => {
        setSubtitle(text);

        if (!("speechSynthesis" in window) || isMuted) {
          setSubtitle("");
          resolve();
          return;
        }

        window.speechSynthesis.cancel();

        const humanText = text
          .replace(/,/g, ", ... ")
          .replace(/\./g, ". ... ");

        const utterance = new SpeechSynthesisUtterance(humanText);

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        utterance.rate = 0.92;
        utterance.pitch = 1.05;
        utterance.volume = 1;

        utterance.onstart = () => {
          setIsAIPlaying(true);
          videoRef.current?.play().catch(() => {});
        };

        utterance.onend = () => {
          videoRef.current?.pause();

          if (videoRef.current) {
            videoRef.current.currentTime = 0;
          }

          setIsAIPlaying(false);
          setSubtitle("");
          resolve();
        };

        utterance.onerror = () => {
          setIsAIPlaying(false);
          videoRef.current?.pause();
          setSubtitle("");
          resolve();
        };

        window.speechSynthesis.speak(utterance);
      });
    },
    [selectedVoice, isMuted]
  );

  useEffect(() => {
    speakTextRef.current = speakText;
  }, [speakText]);

  // ------------------------------------------
  // Read the introduction once, then read each question
  // ------------------------------------------

  useEffect(() => {
    if (!currentQuestion || introStartedRef.current) return;

    const runInterviewIntro = async () => {
      introStartedRef.current = true;
      await speakTextRef.current(
        `Hello ${userName}, welcome to your ${mode} interview for the ${role} role. I will ask you a few questions. Please answer naturally and take your time. Let's begin.`
      );
      setIsIntroEnded(true);
    };

    runInterviewIntro();
  }, [currentQuestion, userName, role, mode]);

  useEffect(() => {
    if (!isIntroEnded || !currentQuestion) return;

    let cancelled = false;
    const video = videoRef.current;

    speakTextRef.current(currentQuestion.question).then(() => {
      if (!cancelled) setReadyQuestionIndex(currentIndex);
    });

    return () => {
      cancelled = true;
      window.speechSynthesis?.cancel();
      video?.pause();
      setIsAIPlaying(false);
    };
  }, [isIntroEnded, currentIndex, currentQuestion]);

  // ------------------------------------------
  // Question timer
  // ------------------------------------------

  useEffect(() => {
    if (
      !isQuestionReady ||
      isSubmitting ||
      evaluation ||
      !currentQuestion
    ) {
      return;
    }

    if (timeLeft <= 0) {
      submitAnswerRef.current?.();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isQuestionReady, isSubmitting, evaluation, currentQuestion]);

  // ------------------------------------------
  // ------------------------------------------
  // Microphone / speech recognition
  // ------------------------------------------

  const toggleMicrophone = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Speech recognition is not supported in this browser. Try Chrome."
      );
      return;
    }

    if (isMicOn) {
      stopMicrophone();
      return;
    }

    stopSpeech();

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsMicOn(true);
      setError("");
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let index = event.resultIndex; index < event.results.length; index++) {
        if (event.results[index].isFinal) {
          finalTranscript += `${event.results[index][0].transcript} `;
        }
      }

      if (finalTranscript.trim()) {
        setAnswer((previous) =>
          `${previous}${previous && !previous.endsWith(" ") ? " " : ""}${finalTranscript.trim()}`
        );
      }
    };

    recognition.onerror = (event) => {
      setIsMicOn(false);

      if (event.error !== "no-speech") {
        setError("Microphone recognition failed. Please try again.");
      }
    };

    recognition.onend = () => {
      setIsMicOn(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      setIsMicOn(false);
      setError("Could not start the microphone. Please try again.");
    }
  };

  // ------------------------------------------
  // Finish interview and generate report
  // ------------------------------------------

  const finishInterview = useCallback(async () => {
    if (isFinishing) return;
    setIsFinishing(true);
    setError("");

    stopMicrophone();
    stopSpeech();

    try {
      const response = await axios.post(
        `${API_URL}/api/resume/finish-interview`,
        { interviewId },
        { withCredentials: true }
      );

      const report = response.data?.data || response.data;

      if (onFinish) {
        onFinish(report);
      }
    } catch (err) {
      console.error("Interview completion failed:", err);
      setError(
        err.response?.data?.message ||
          "Unable to finish the interview. Please try again."
      );
    } finally {
      setIsFinishing(false);
    }
  }, [interviewId, isFinishing, onFinish, stopMicrophone, stopSpeech]);

  // ------------------------------------------
  // Submit answer and get AI evaluation
  // ------------------------------------------

  const handleSubmitAnswer = useCallback(async () => {
    if (!currentQuestion || !answer.trim() || evaluation || submitLockRef.current) {
      return;
    }

    submitLockRef.current = true;
    setIsSubmitting(true);
    setError("");

    stopMicrophone();
    stopSpeech();

    try {
      const response = await axios.post(
        `${API_URL}/api/resume/submit-answers`,
        {
          interviewId,
          questionId: currentQuestion._id,
          answer: answer.trim(),
        },
        { withCredentials: true }
      );

      setEvaluation(response.data?.data || response.data);
      if (isLastQuestion) {
        await finishInterview();
      }
    } catch (err) {
      console.error("Answer submission failed:", err);

      setError(
        err.response?.data?.message ||
          "Unable to submit your answer. Please try again."
      );

      // If the timer expired, give the user a chance to retry.
      if (timeLeft <= 0) {
        setTimeLeft(10);
      }
    } finally {
      submitLockRef.current = false;
      setIsSubmitting(false);
    }
  }, [
    answer,
    currentQuestion,
    evaluation,
    finishInterview,
    interviewId,
    isLastQuestion,
    stopMicrophone,
    stopSpeech,
    timeLeft,
  ]);

  useEffect(() => {
    submitAnswerRef.current = handleSubmitAnswer;
  }, [handleSubmitAnswer]);

  const handleNextQuestion = () => {
    if (!evaluation) return;
    setAnswer("");
    setEvaluation(null);
    setError("");
    stopMicrophone();
    stopSpeech();

    if (isLastQuestion) {
      finishInterview();
      return;
    }

    setTimeLeft(questions[currentIndex + 1]?.timeLimit || 60);
    setCurrentIndex((previous) => previous + 1);
  };

  // ------------------------------------------
  // Cleanup
  // ------------------------------------------

  useEffect(() => {
    const video = videoRef.current;

    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        // Ignore cleanup errors.
      }

      window.speechSynthesis?.cancel();
      video?.pause();
    };
  }, []);

  if (!questions.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090B] p-6 text-white">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-400" size={36} />
          <h2 className="text-xl font-semibold">No interview questions found</h2>
          <p className="mt-2 text-sm text-gray-400">
            Return to setup and generate your interview questions again.
          </p>
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // UI
  // ------------------------------------------

  return (
    <main className="min-h-screen bg-[#09090B] px-4 py-6 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
                <Bot size={21} />
              </div>
              <h1 className="text-xl font-bold tracking-tight">
                VELTO<span className="text-indigo-400">.</span>
              </h1>
            </div>

            <p className="mt-2 text-sm text-gray-400">
              AI-powered interview session
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs font-semibold text-indigo-300">
              {mode} INTERVIEW
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
              <UserRound className="mr-2 inline" size={15} />
              {userName}
            </span>
          </div>
        </header>

        {/* Progress */}
        <section className="mb-7">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-gray-400">Interview progress</span>
            <span className="font-semibold text-indigo-300">
              {currentIndex + 1} / {totalQuestions}
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-500"
              style={{
                width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
              }}
            />
          </div>
        </section>

        {/* Main layout */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">

          {/* AI interviewer panel */}
          <div className="rounded-3xl border border-white/10 bg-[#111114] p-4 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">AI Interviewer</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Your virtual interview partner
                </p>
              </div>

              <span
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs ${
                  isAIPlaying
                    ? "bg-indigo-500/15 text-indigo-300"
                    : "bg-white/5 text-gray-400"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isAIPlaying ? "animate-pulse bg-indigo-400" : "bg-gray-500"
                  }`}
                />
                {isAIPlaying ? "Speaking" : "Listening"}
              </span>
            </div>

            {/* Video */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black">
              <video
                key={videoSource}
                ref={videoRef}
                src={videoSource}
                muted
                playsInline
                preload="auto"
                className="aspect-[4/5] max-h-[430px] w-full object-cover"
              />

              {!isAIPlaying && (
                <div className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/60 px-3 py-2 text-xs text-gray-200 backdrop-blur">
                  AI Interviewer
                </div>
              )}

              {isAIPlaying && (
                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-indigo-600/90 px-3 py-2 text-xs font-medium">
                  <Volume2 size={14} />
                  Speaking...
                </div>
              )}
              {subtitle && (
                <div
                  aria-live="polite"
                  className="absolute inset-x-3 bottom-14 rounded-xl bg-black/75 px-4 py-3 text-center text-sm leading-6 text-white backdrop-blur"
                >
                  {subtitle}
                </div>
              )}
            </div>

            {/* Voice controls */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-gray-500">Interviewer voice</p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => {
                      stopSpeech();
                      setVoiceGender("female");
                    }}
                    className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                      voiceGender === "female"
                        ? "bg-indigo-600 text-white"
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    Female
                  </button>

                  <button
                    onClick={() => {
                      stopSpeech();
                      setVoiceGender("male");
                    }}
                    className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                      voiceGender === "male"
                        ? "bg-indigo-600 text-white"
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    Male
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  stopSpeech();
                  setIsMuted((previous) => !previous);
                }}
                className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/5"
              >
                {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
                {isMuted ? "Unmute" : "Mute"}
              </button>
            </div>
          </div>

          {/* Question and answer panel */}
          <div className="flex flex-col gap-6">

            {/* Timer and question details */}
            <div className="rounded-3xl border border-white/10 bg-[#111114] p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-5">
                <div>
                  <p className="text-sm text-gray-500">Current question</p>
                  <h2 className="mt-1 text-3xl font-bold">
                    {String(currentIndex + 1).padStart(2, "0")}
                    <span className="ml-2 text-base font-normal text-gray-500">
                      / {String(totalQuestions).padStart(2, "0")}
                    </span>
                  </h2>
                </div>

                <Timer
                  timeleft={timeLeft}
                  totaltime={currentQuestion.timeLimit || 60}
                />
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
                    Question {currentIndex + 1}
                  </span>

                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-400">
                    {currentQuestion.difficulty || "Medium"}
                  </span>

                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-400">
                    {currentQuestion.timeLimit || 60} seconds
                  </span>
                </div>

                <h3 className="text-lg font-semibold leading-relaxed text-gray-100 sm:text-xl">
                  {isIntroEnded
                    ? currentQuestion.question
                    : "The interviewer is introducing the session..."}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  {isIntroEnded
                    ? "Listen to the question and provide a clear, structured answer."
                    : "Your first question will appear after the introduction."}
                </p>
              </div>
            </div>

            {/* Answer input */}
            <div className="flex-1 rounded-3xl border border-white/10 bg-[#111114] p-5 sm:p-7">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">Your answer</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Type your response or use voice input.
                  </p>
                </div>

                <span className="text-xs text-gray-500">
                  {answer.trim().length} characters
                </span>
              </div>

              <textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                disabled={isSubmitting || !isQuestionReady || !!evaluation}
                placeholder="Start typing your answer here..."
                className="min-h-48 w-full resize-y rounded-2xl border border-white/10 bg-[#09090B] p-4 text-sm leading-7 text-gray-200 outline-none transition placeholder:text-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
              />

              {error && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                  <AlertCircle className="mt-0.5 shrink-0" size={16} />
                  {error}
                </div>
              )}

              {evaluation && (
                <section
                  aria-live="polite"
                  className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4"
                >
                  <h3 className="font-semibold text-emerald-300">
                    Answer feedback
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-200">
                    {evaluation.feedback || "Your answer has been evaluated."}
                  </p>
                  {evaluation.evaluation && (
                    <p className="mt-3 text-xs text-gray-400">
                      Score: {evaluation.evaluation.finalScore}/10
                      {" · "}Confidence: {evaluation.evaluation.confidence}/10
                      {" · "}Communication: {evaluation.evaluation.communication}/10
                      {" · "}Correctness: {evaluation.evaluation.correctness}/10
                    </p>
                  )}
                </section>
              )}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={toggleMicrophone}
                  disabled={isSubmitting || !isQuestionReady || !!evaluation}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    isMicOn
                      ? "border-red-500/30 bg-red-500/10 text-red-400"
                      : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  {isMicOn ? <MicOff size={18} /> : <Mic size={18} />}
                  {isMicOn ? "Stop recording" : "Use microphone"}
                </button>

                {!evaluation ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={
                      isSubmitting ||
                      !isQuestionReady ||
                      !answer.trim()
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <LoaderCircle className="animate-spin" size={18} />
                        Evaluating...
                      </>
                    ) : (
                      <>
                        Evaluate answer
                        <Send size={17} />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    disabled={isFinishing}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isFinishing ? (
                      <>
                        <LoaderCircle className="animate-spin" size={18} />
                        Finishing...
                      </>
                    ) : (
                      <>
                        {isLastQuestion ? "Finish interview" : "Next question"}
                        <Send size={17} />
                      </>
                    )}
                  </button>
                )}
              </div>

              {!isQuestionReady && (
                <p className="mt-3 text-center text-xs text-gray-500">
                  Please wait while the interviewer reads the question.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-xs text-gray-500">
          <p>
            <Clock3 className="mr-1 inline" size={13} />
            Your answer is evaluated after submission.
          </p>

          <p className="flex items-center gap-1">
            <CheckCircle2 size={14} className="text-indigo-400" />
            Interview session in progress
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Step2Interview;