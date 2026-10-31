import { motion } from "motion/react";
import { AudioLines, ArrowRight } from "lucide-react";
import { linkWithCredential, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firbase";
import { X } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setuserdata } from "../redux/userslice";
import { useState } from "react";
function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.7c3.9-3.6 6-8.8 6-15Z"
      />
      <path
        fill="#34A853"
        d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.7-5.1c-1.8 1.2-4.1 1.9-6.8 1.9-5.2 0-9.6-3.5-11.2-8.2H5.9v5.3A20 20 0 0 0 24 44Z"
      />
      <path
        fill="#FBBC05"
        d="M12.8 27.7a12 12 0 0 1 0-7.4V15H5.9a20 20 0 0 0 0 18l6.9-5.3Z"
      />
      <path
        fill="#EA4335"
        d="M24 12.1c3 0 5.7 1 7.8 3.1l5.9-5.9A19.7 19.7 0 0 0 24 4 20 20 0 0 0 5.9 15l6.9 5.3c1.6-4.7 6-8.2 11.2-8.2Z"
      />
    </svg>
  );
}

const SERVERURL = "http://localhost:8055/api/auth";
export default function Auth({ isModal = false, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
const handleGoogleSignIn = async () => {
  try {
    setLoading(true);
    setError("");

    const response = await signInWithPopup(auth, provider);

    const name = response.user.displayName;
    const email = response.user.email;

    const result = await axios.post(
      `${SERVERURL}/google`,
      { name, email },
      { withCredentials: true }
    );

    dispatch(setuserdata(result.data.user));

    // Close only when Auth is displayed as a modal.
    if (isModal) {
      onClose?.();
    }
  } catch (error) {
    console.error("Google sign-in failed:", error);
    setError(
      error.response?.data?.message ||
      "Unable to sign in. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (

  <div
    className={
      isModal
        ? "fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
        : "flex min-h-screen items-center justify-center bg-[#f4f4f2] px-5 py-10 font-sans text-[#111]"
    }
    onMouseDown={(e) => {
      if (isModal && e.target === e.currentTarget) {
        onClose?.();
      }
    }}
  >
    <motion.section
      initial={{ opacity: 0, y: 16, scale: isModal ? 0.97 : 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`relative w-full rounded-2xl border border-[#e7e7e4] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)] ${
        isModal
          ? "max-w-[410px] px-7 py-8 sm:px-9"
          : "max-w-[420px] px-7 py-10 sm:px-11 sm:py-12"
      }`}
    >
      {/* Close button - modal only */}
      {isModal && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close authentication"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-black"
        >
          <X size={19} />
        </button>
      )}

      {/* Branding */}
      <motion.a
        href="/"
        className={`inline-flex items-center gap-2.5 ${
          isModal ? "mb-7" : "mb-12"
        }`}
        aria-label="VELTO home"
      >
        <AudioLines size={23} strokeWidth={1.8} />
        <span className="text-lg font-semibold tracking-[0.16em]">
          VELTO
        </span>
      </motion.a>

      {/* Heading */}
      <motion.div>
        <h1
          className={`font-semibold tracking-tight ${
            isModal ? "text-2xl" : "text-3xl"
          }`}
        >
          Sign in
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#777]">
          Continue to access your dashboard.
        </p>
      </motion.div>

      {/* Google sign-in */}
      <motion.button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.99 }}
        className="mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-full border border-[#dedede] bg-white text-sm font-medium transition-colors hover:border-[#aaa] hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <GoogleIcon />

        {loading ? "Signing in..." : "Continue with Google"}

        {!loading && (
          <ArrowRight size={16} className="ml-auto text-[#888]" />
        )}
      </motion.button>

      {/* Error */}
      {error && (
        <p className="mt-3 text-xs text-red-500">
          {error}
        </p>
      )}

      {/* Footer */}
      <motion.p
        className={`text-center text-[11px] tracking-wide text-[#999] ${
          isModal ? "mt-7" : "mt-10"
        }`}
      >
        MEET YOUR POTENTIAL.
      </motion.p>
    </motion.section>
  </div>
);
}
