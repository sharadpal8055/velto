
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

import {
  Sparkles,
  Bot,
  Mic,
  ArrowRight,
  Clock,
  Target,
  BrainCircuit,
  ShieldCheck,
  History,
  Zap,
  ChartNoAxesColumnIncreasing,
  FileText,
  FileDown,
  ChartLine,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Auth from "./Auth";

// Images
import aiInterviewImg from "../assets/ai-ans.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import historyImg from "../assets/history.png";

import hrInterviewImg from "../assets/HR.png";
import technicalInterviewImg from "../assets/MM.png";
import confidenceImg from "../assets/confi.png";
import creditsImg from "../assets/credit.png";

// Animation presets
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const sectionHeading =
  "text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl";

// Advanced AI capabilities
const capabilities = [
  {
    id: 1,
    image: aiInterviewImg,
    icon: ChartNoAxesColumnIncreasing,
    title: "AI Answer Evaluation",
    description:
      "Scores communication, technical accuracy and confidence.",
  },
  {
    id: 2,
    image: resumeImg,
    icon: FileText,
    title: "Resume Based Interview",
    description:
      "Project-specific questions based on your uploaded resume.",
  },
  {
    id: 3,
    image: pdfImg,
    icon: FileDown,
    title: "Downloadable PDF Report",
    description:
      "Detailed strengths, weaknesses and improvement insights.",
  },
  {
    id: 4,
    image: historyImg,
    icon: ChartLine,
    title: "History & Analytics",
    description:
      "Track progress with performance graphs and topic analysis.",
  },
];

// How VELTO works
const steps = [
  {
    icon: Bot,
    step: "STEP 1",
    title: "Role & Experience Selection",
    description:
      "AI adjusts difficulty based on your selected job role.",
  },
  {
    icon: Mic,
    step: "STEP 2",
    title: "Smart Voice Interview",
    description:
      "Dynamic follow-up questions based on your answers.",
  },
  {
    icon: Clock,
    step: "STEP 3",
    title: "Timer Based Simulation",
    description:
      "Experience real interview pressure with time tracking.",
  },
];

// Interview modes
const interviewModes = [
  {
    id: 1,
    image: hrInterviewImg,
    title: "HR Interview Mode",
    description:
      "Behavioral and communication-based evaluation.",
  },
  {
    id: 2,
    image: technicalInterviewImg,
    title: "Technical Mode",
    description:
      "Deep technical questioning based on your selected role.",
  },
  {
    id: 3,
    image: confidenceImg,
    title: "Confidence Detection",
    description:
      "Basic tone and voice analysis insights.",
  },
  {
    id: 4,
    image: creditsImg,
    title: "Credits System",
    description:
      "Unlock premium interview sessions easily.",
  },
];

// Why VELTO
const features = [
  {
    icon: BrainCircuit,
    title: "AI-Powered Questions",
    description:
      "Practice with intelligent questions tailored to your selected role.",
  },
  {
    icon: Target,
    title: "Adaptive Difficulty",
    description:
      "Experience dynamic follow-up questions based on your responses.",
  },
  {
    icon: Clock,
    title: "Real-Time Evaluation",
    description:
      "Understand your performance and identify areas for improvement.",
  },
];

const Home = () => {
  const { userdata } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [showAuthModal, setShowAuthModal] = useState(false);

  const isLoggedIn = Boolean(userdata);

  // Start interview
  const handleStartInterview = () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    navigate("/interviews");
  };

  // View interview history
  const handleViewHistory = () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    navigate("/history");
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F8F9FB] text-gray-950">

      {/* NAVBAR */}
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative isolate overflow-hidden px-4 pb-20 pt-20 sm:px-6 sm:pb-24 sm:pt-28">

        {/* Background decoration */}
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-indigo-100/60 blur-[110px] sm:h-[500px] sm:w-[500px]" />

        <div className="mx-auto max-w-5xl text-center">

          {/* Badge */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-7 inline-flex max-w-full items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-2 shadow-sm sm:px-4"
          >
            <Sparkles
              size={15}
              className="shrink-0 text-indigo-600"
            />

            <span className="text-[10px] font-semibold tracking-wide text-gray-700 sm:text-xs">
              AI-POWERED SMART INTERVIEW PLATFORM
            </span>

            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Practice smarter.
            <br />
            <span className="text-indigo-600">
              Interview better.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-gray-500 sm:mt-7 sm:text-base md:text-lg"
          >
            Prepare for your next opportunity with AI-powered mock
            interviews, role-based questions, intelligent follow-ups,
            and real-time performance evaluation.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4"
          >
            <button
              onClick={handleStartInterview}
              className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-gray-950 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              Start Interview

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

            <button
              onClick={handleViewHistory}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-7 py-3.5 text-sm font-semibold text-gray-800 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:bg-indigo-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              <History size={17} />
              View History
            </button>
          </motion.div>

          {/* Trust message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-400"
          >
            <ShieldCheck size={15} className="text-indigo-600" />
            Practice at your own pace. Improve with every interview.
          </motion.div>

        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="px-4 py-16 sm:px-6 sm:py-24">

        <div className="mx-auto max-w-6xl">

          <div className="mb-16 text-center">
            <p className="text-xs font-bold tracking-[0.2em] text-indigo-600">
              SIMPLE PROCESS
            </p>

            <h2 className={`${sectionHeading} mt-4`}>
              How VELTO Works
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
              From selecting your role to evaluating your performance,
              prepare for interviews through three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
            {steps.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.step}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeUp}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.12,
                  }}
                  whileHover={{ y: -6 }}
                  className="relative flex min-h-[230px] flex-col items-center justify-center rounded-[26px] border border-indigo-100 bg-white px-6 pb-8 pt-14 text-center shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_16px_35px_rgba(79,70,229,0.10)] md:even:-translate-y-3"
                >
                  {/* Floating icon */}
                  <div className="absolute -top-8 flex h-16 w-16 items-center justify-center rounded-[19px] border-2 border-indigo-400 bg-white shadow-md">
                    <Icon
                      size={26}
                      strokeWidth={1.8}
                      className="text-indigo-600"
                    />
                  </div>

                  <span className="text-xs font-bold tracking-wider text-indigo-600">
                    {item.step}
                  </span>

                  <h3 className="mt-3 text-base font-semibold tracking-tight text-gray-950 sm:text-lg">
                    {item.title}
                  </h3>

                  <p className="mt-3 max-w-[270px] text-sm leading-6 text-gray-500">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= AI CAPABILITIES ================= */}
      <section className="border-y border-gray-100 bg-white px-4 py-16 sm:px-6 sm:py-24">

        <div className="mx-auto max-w-6xl">

          <div className="mb-12 text-center sm:mb-16">
            <p className="text-xs font-bold tracking-[0.2em] text-indigo-600">
              POWERED BY AI
            </p>

            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className={`${sectionHeading} mt-4`}
            >
              Advanced AI{" "}
              <span className="text-indigo-600">
                Capabilities
              </span>
            </motion.h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
              Powerful AI features designed to make every interview
              practice session more effective.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-7">
            {capabilities.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeUp}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  whileHover={{ y: -5 }}
                  className="group flex min-h-[220px] flex-col items-center gap-4 rounded-2xl border border-gray-100 bg-[#FAFBFC] p-5 shadow-sm transition-all duration-300 hover:border-indigo-100 hover:bg-white hover:shadow-xl sm:flex-row sm:p-6 lg:gap-6"
                >

                  {/* Image */}
                  <div className="flex h-40 w-full shrink-0 items-center justify-center sm:h-44 sm:w-[44%]">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="w-full flex-1 text-center sm:text-left">

                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Icon size={20} strokeWidth={1.8} />
                    </div>

                    <h3 className="text-base font-semibold tracking-tight text-gray-950 sm:text-lg">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                      {item.description}
                    </p>
                  </div>

                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= INTERVIEW MODES ================= */}
      <section className="px-4 py-16 sm:px-6 sm:py-24">

        <div className="mx-auto max-w-5xl">

          <div className="mb-12 text-center sm:mb-14">
            <p className="text-xs font-bold tracking-[0.2em] text-indigo-600">
              PERSONALIZED PRACTICE
            </p>

            <h2 className={`${sectionHeading} mt-4`}>
              Multiple Interview{" "}
              <span className="text-indigo-600">
                Modes
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
              Explore different interview experiences designed
              to strengthen your preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-7">
            {interviewModes.map((mode, index) => (
              <motion.div
                key={mode.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                whileHover={{ y: -5 }}
                className="group flex min-h-[165px] items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:border-indigo-100 hover:shadow-lg sm:p-6"
              >

                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold tracking-tight text-gray-950 sm:text-lg">
                    {mode.title}
                  </h3>

                  <p className="mt-3 max-w-[250px] text-xs leading-6 text-gray-500 sm:text-sm">
                    {mode.description}
                  </p>
                </div>

                <div className="h-24 w-24 shrink-0 sm:h-28 sm:w-28">
                  <img
                    src={mode.image}
                    alt={mode.title}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= WHY VELTO ================= */}
      <section className="border-y border-gray-100 bg-white px-4 py-16 sm:px-6 sm:py-24">

        <div className="mx-auto max-w-6xl">

          <div className="mb-12 text-center">
            <p className="text-xs font-bold tracking-[0.2em] text-indigo-600">
              WHY VELTO?
            </p>

            <h2 className={`${sectionHeading} mt-4`}>
              Everything You Need to Prepare
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
              More than just questions. Build confidence through
              structured, intelligent interview practice.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  whileHover={{ y: -5 }}
                  className="group rounded-2xl border border-gray-100 bg-[#FAFBFC] p-6 transition-all duration-300 hover:border-indigo-100 hover:bg-white hover:shadow-xl sm:p-7"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-950 text-white transition-colors duration-300 group-hover:bg-indigo-600">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>

                  <h3 className="mt-6 text-lg font-semibold text-gray-950">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-500">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section className="px-4 py-16 sm:px-6 sm:py-24">

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gray-950 px-6 py-14 text-center text-white sm:px-12 sm:py-16"
        >

          {/* Decorative background */}
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-[80px]" />

          <div className="relative z-10">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-indigo-400">
              <Zap size={23} />
            </div>

            <h2 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Your Next Opportunity Starts Here.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
              Take the next step towards interview readiness.
              Start practicing with VELTO today.
            </p>

            <button
              onClick={handleStartInterview}
              className="group mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-gray-950 transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
            >
              Get Started

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

          </div>
        </motion.div>

      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-gray-200 bg-white px-4 py-10 sm:px-6">

        <div className="mx-auto flex max-w-6xl flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">

          {/* Branding */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-950 text-white">
                <Bot size={21} strokeWidth={1.8} />
              </div>

              <span className="text-lg font-bold tracking-[0.15em] text-gray-950">
                VELTO
              </span>
            </div>

            <p className="text-[10px] font-semibold tracking-[0.18em] text-indigo-600">
              MEET YOUR POTENTIAL.
            </p>
          </div>

          {/* Description */}
          <div className="max-w-md">
            <p className="text-sm leading-7 text-gray-500">
              An AI-powered interview preparation platform designed
              to improve communication skills, technical depth,
              and professional confidence.
            </p>
          </div>

          {/* Copyright */}
          <div className="sm:text-right">
            <p className="text-xs font-medium text-gray-500">
              © {new Date().getFullYear()} VELTO
            </p>

            <p className="mt-1 text-[10px] tracking-[0.15em] text-gray-400">
              ALL RIGHTS RESERVED.
            </p>
          </div>

        </div>

        <div className="mx-auto mt-8 max-w-6xl border-t border-gray-100 pt-5">
          <p className="text-center text-[11px] tracking-wide text-gray-400">
            Built to help you become interview-ready.
          </p>
        </div>

      </footer>

      {/* ================= AUTH MODAL ================= */}
      {showAuthModal && (
        <Auth
          isModal={true}
          onClose={() => setShowAuthModal(false)}
        />
      )}

    </main>
  );
};

export default Home;
