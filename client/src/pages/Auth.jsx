import { motion } from "motion/react";
import { AudioLines, ArrowRight } from "lucide-react";
import { linkWithCredential, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firbase";
import axios from 'axios'
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
const SERVERURL='http://localhost:8055/api/auth'
export default function Auth() {
  const handleGoogleSignIn = async() => {
  try {
      const response = await signInWithPopup(auth, provider);

      const name = response.user.displayName;
      const email = response.user.email;

      const result = await axios.post(
        `${SERVERURL}/google`,
        { name, email },
        { withCredentials: true }
      );

      console.log("Google login successful:", result.data);
      console.log("User:", result.data.user);

    } catch (error) {
  console.log(`error while signing in with google ${error}`)
}

  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f4f2] px-5 py-10 font-sans text-[#111]">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[420px] rounded-2xl border border-[#e7e7e4] bg-white px-7 py-10 shadow-[0_12px_40px_rgba(0,0,0,0.04)] sm:px-11 sm:py-12"
      >
        <motion.a
          href="/"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mb-12 inline-flex items-center gap-2.5"
          aria-label="VELTO home"
        >
          <AudioLines size={23} strokeWidth={1.8} />
          <span className="text-lg font-semibold tracking-[0.16em]">VELTO</span>
        </motion.a>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>

          <p className="mt-2 text-sm leading-6 text-[#777]">
            Continue to access your dashboard.
          </p>
        </motion.div>

        <motion.button
          type="button"
          onClick={handleGoogleSignIn}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.99 }}
          className="mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-full border border-[#dedede] bg-white text-sm font-medium transition-colors hover:border-[#aaa] hover:bg-[#fafafa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          <GoogleIcon />
          Continue with Google
          <ArrowRight size={16} className="ml-auto text-[#888]" />
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="mt-10 text-center text-[11px] tracking-wide text-[#999]"
        >
          MEET YOUR POTENTIAL.
        </motion.p>
      </motion.section>
    </main>
  );
}
