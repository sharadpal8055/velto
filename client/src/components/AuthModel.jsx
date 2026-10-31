import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, ArrowRight, AudioLines, LoaderCircle } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firbase";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setuserdata } from "../redux/userslice";

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || "http://localhost:8055";

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

const AuthModel = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await signInWithPopup(auth, provider);

      const name = response.user.displayName;
      const email = response.user.email;

      const result = await axios.post(
        `${SERVER_URL}/api/auth/google`,
        { name, email },
        { withCredentials: true }
      );

      if (!result.data?.success || !result.data?.user) {
        throw new Error("Unable to complete authentication");
      }

      // Store only the user object in Redux
      dispatch(setuserdata(result.data.user));

      // Close modal after successful login
      onClose();
    } catch (error) {
      console.error(
        "Google authentication error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Google sign-in failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !loading) {
              onClose();
            }
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative w-full max-w-[410px] rounded-3xl border border-white/70 bg-white p-7 shadow-2xl sm:p-9"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label="Close sign in modal"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-black disabled:opacity-40"
            >
              <X size={19} />
            </button>

            {/* Branding */}
            <div className="mb-8 flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                <AudioLines size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold tracking-tight text-gray-950">
                  VELTO
                </h2>
                <p className="text-[9px] font-semibold tracking-[0.15em] text-gray-500">
                  MEET YOUR POTENTIAL.
                </p>
              </div>
            </div>

            {/* Heading */}
            <div>
              <h2
                id="auth-modal-title"
                className="text-2xl font-semibold tracking-tight text-gray-950"
              >
                Your next opportunity starts here.
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Sign in to access your credits, practice AI interviews and
                track your progress.
              </p>
            </div>

            {/* Google button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="mt-7 flex h-12 w-full items-center justify-center gap-3 rounded-full border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-800 transition hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle size={19} className="animate-spin" />
                  Signing you in...
                </>
              ) : (
                <>
                  <GoogleIcon />
                  Continue with Google
                  <ArrowRight size={16} className="ml-auto text-gray-400" />
                </>
              )}
            </button>

            {/* Error */}
            {error && (
              <p
                role="alert"
                className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-xs leading-5 text-red-600"
              >
                {error}
              </p>
            )}

            <p className="mt-7 text-center text-[10px] font-medium tracking-widest text-gray-400">
              PREPARE BETTER. PERFORM BETTER.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModel;