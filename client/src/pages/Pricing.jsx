
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  LoaderCircle,
  Sparkles,
  Zap,
  Crown,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setuserdata } from "../redux/userslice";
import { API_URL } from "../config/api";

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const plans = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    credits: 100,
    description: "Explore AI-powered interview preparation.",
    icon: ShieldCheck,
    features: [
      "100 AI Interview Credits",
      "Basic Performance Report",
      "Voice Interview Access",
      "Limited Interview History",
    ],
    button: "Current Plan",
  },
  {
    id: "starter",
    name: "Starter",
    price: "₹100",
    credits: 150,
    description: "Build confidence through focused practice.",
    icon: Zap,
    features: [
      "150 AI Interview Credits",
      "Detailed AI Feedback",
      "Performance Analytics",
      "Full Interview History",
    ],
    button: "Choose Starter",
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹500",
    credits: 650,
    description: "Get serious about your next career move.",
    icon: Crown,
    badge: "BEST VALUE",
    features: [
      "650 AI Interview Credits",
      "Advanced AI Feedback",
      "Skill Trend Analysis",
      "Priority AI Processing",
      "Complete Interview Insights",
    ],
    button: "Choose Pro",
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userdata } = useSelector((state) => state.user);
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [processingPlan, setProcessingPlan] = useState("");
  const [paymentError, setPaymentError] = useState("");

  const startCheckout = async (plan) => {
    if (!userdata) {
      navigate("/auth");
      return;
    }

    setSelectedPlan(plan.id);
    setProcessingPlan(plan.id);
    setPaymentError("");

    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        throw new Error("Unable to load Razorpay Checkout. Check your connection and try again.");
      }

      const { data: orderResponse } = await axios.post(
        `${API_URL}/api/payment/create-order`,
        { planId: plan.id },
        { withCredentials: true }
      );
      const order = orderResponse?.data;
      if (!order?.orderId || !order?.keyId) {
        throw new Error("The server returned an invalid payment order.");
      }

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "VELTO",
        description: `${order.planName} · ${order.credits} credits`,
        order_id: order.orderId,
        prefill: order.prefill,
        theme: { color: "#6366F1" },
        modal: {
          ondismiss: () => setProcessingPlan(""),
        },
        handler: async (paymentResponse) => {
          setProcessingPlan(plan.id);
          try {
            const { data: verification } = await axios.post(
              `${API_URL}/api/payment/verify`,
              paymentResponse,
              { withCredentials: true }
            );

            const creditBalance = verification?.data?.credits;
            if (!Number.isFinite(creditBalance)) {
              throw new Error("Payment verified, but the updated credit balance was missing.");
            }

            dispatch(
              setuserdata({
                ...userdata,
                credit: creditBalance,
              })
            );
            navigate("/");
          } catch (verificationError) {
            console.error("Payment verification request failed:", verificationError);
            setPaymentError(
              verificationError.response?.data?.message ||
                verificationError.message ||
                "Payment completed, but verification failed. Please contact support before trying again."
            );
          } finally {
            setProcessingPlan("");
          }
        },
      });

      checkout.on("payment.failed", (event) => {
        setPaymentError(
          event.error?.description ||
            "Payment failed. Please try another payment method."
        );
        setProcessingPlan("");
      });

      setProcessingPlan("");
      checkout.open();
    } catch (error) {
      console.error("Unable to start Razorpay checkout:", error);
      setPaymentError(
        error.response?.data?.message ||
          error.message ||
          "Unable to start checkout. Please try again."
      );
      setProcessingPlan("");
    }
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#080B14", color: "#F8FAFC" }}
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute -right-40 top-40 h-96 w-96 rounded-full bg-indigo-500/15 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 h-72 w-96 -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Navigation */}
        <nav className="flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            aria-label="Back to Home"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-300 transition hover:border-indigo-400/50 hover:bg-indigo-500/10 hover:text-white"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="text-xl font-bold tracking-tight text-white"
          >
            VELTO<span className="text-indigo-400">.</span>
          </button>
        </nav>

        {/* Heading */}
        <header className="mx-auto mb-14 mt-16 max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-xs font-semibold tracking-wider text-indigo-300">
            <Sparkles size={14} />
            SIMPLE AND TRANSPARENT PRICING
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Invest in your
            <span className="block bg-gradient-to-r from-indigo-300 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              next opportunity.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
            Practice smarter, improve your interview skills, and get closer
            to your dream job with AI-powered preparation.
          </p>
        </header>

        {paymentError && (
          <div
            role="alert"
            className="mx-auto mb-8 max-w-2xl rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-200"
          >
            {paymentError}
          </div>
        )}

        {/* Plans */}
        <section
          aria-label="Available pricing plans"
          className="grid items-stretch gap-6 md:grid-cols-3"
        >
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const isPro = plan.id === "pro";
            const Icon = plan.icon;

            return (
              <article
                key={plan.id}
                className={`relative flex flex-col rounded-3xl border p-7 transition duration-300 hover:-translate-y-1 ${
                  isPro
                    ? "border-indigo-500/70 shadow-[0_0_50px_rgba(79,70,229,0.16)]"
                    : "border-white/10 hover:border-indigo-400/40"
                }`}
                style={{
                  background: isPro
                    ? "linear-gradient(180deg, #202044 0%, #111522 100%)"
                    : "#111522",
                }}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-indigo-500 px-4 py-1.5 text-[10px] font-bold tracking-widest text-white shadow-lg shadow-indigo-500/30">
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={12} />
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Plan heading */}
                <div className="mb-6 flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      isPro
                        ? "bg-indigo-500 text-white"
                        : "border border-indigo-400/20 bg-indigo-500/10 text-indigo-300"
                    }`}
                  >
                    <Icon size={22} />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {plan.name}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {plan.id === "free"
                        ? "Get started"
                        : plan.id === "starter"
                          ? "For focused learners"
                          : "For serious candidates"}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="border-b border-white/10 pb-6">
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-4xl font-bold tracking-tight ${
                        isPro ? "text-indigo-300" : "text-white"
                      }`}
                    >
                      {plan.price}
                    </span>
                    {plan.id !== "free" && (
                      <span className="text-sm text-slate-400">/ pack</span>
                    )}
                  </div>

                  <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-500/15 px-3 py-2 text-sm font-semibold text-indigo-300">
                    <Zap size={15} />
                    {plan.credits} Credits
                  </div>

                  <p className="mt-4 min-h-12 text-sm leading-6 text-slate-400">
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <div className="flex-1 py-6">
                  <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-slate-400">
                    What's included
                  </p>

                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-slate-300"
                      >
                        <CheckCircle2
                          size={17}
                          className="mt-0.5 shrink-0 text-indigo-400"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (plan.id === "free") {
                      setSelectedPlan(plan.id);
                      return;
                    }
                    startCheckout(plan);
                  }}
                  disabled={isSelected && plan.id === "free" || !!processingPlan}
                  className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition ${
                    isSelected
                      ? "cursor-default border border-indigo-400/40 bg-indigo-500/15 text-indigo-300"
                      : isPro
                        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-400"
                        : "border border-white/10 bg-white/5 text-white hover:border-indigo-400/50 hover:bg-indigo-500/10"
                  }`}
                >
                  {processingPlan === plan.id ? (
                    <>
                      <LoaderCircle size={17} className="animate-spin" />
                      Starting checkout...
                    </>
                  ) : isSelected && plan.id === "free" ? (
                    <>
                      <Check size={17} />
                      Current Plan
                    </>
                  ) : (
                    <>
                      {plan.id === "free" ? plan.button : "Proceed to Pay"}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </article>
            );
          })}
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-white/10 py-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-sm font-semibold text-slate-200">
                Ready to meet your potential?
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Your next interview could be your best one.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck size={16} className="text-indigo-400" />
              Secure payments powered by Razorpay
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} VELTO. Meet Your Potential.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Pricing;
