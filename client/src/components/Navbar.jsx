import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Bot,
  Coins,
  UserRound,
  History,
  LogOut,
  Sparkles,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";

import { clearUserData } from "../redux/userslice";
import Auth from "../pages/Auth";
const API_URL = import.meta.env.VITE_SERVER_URL;

const Navbar = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { userdata } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showCredits, setShowCredits] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const creditsRef = useRef(null);
  const profileRef = useRef(null);

  const isLoggedIn = Boolean(userdata);

  const credits = isLoggedIn ? (userdata.credit ?? 0) : 0;
  
  const userName = userdata?.name || "User";
 

  const userInitial = userName.charAt(0).toUpperCase();

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (creditsRef.current && !creditsRef.current.contains(event.target)) {
        setShowCredits(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Logout functionality
  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await axios.get(`${API_URL}/api/auth/logout`, {
        withCredentials: true,
      });

      dispatch(clearUserData());

      setShowProfile(false);
      setShowCredits(false);

      navigate("/auth");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    } finally {
      setLoggingOut(false);
    }
  };

  const handleBuyCredits = () => {
    setShowCredits(false);
    navigate("/pricing");
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-4 sm:px-6">
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-gray-200/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-6">
        {/* LEFT: BRANDING */}
        <button
          onClick={() => navigate("/")}
          className="group flex items-center gap-3 text-left"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white shadow-md transition-transform duration-300 group-hover:scale-105">
            <Bot size={23} strokeWidth={1.8} />
            
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-gray-950 sm:text-xl">
              VELTO
            </span>

            <span className="text-[10px] font-medium tracking-[0.12em] text-gray-500 sm:text-xs">
              MEET YOUR POTENTIAL.
            </span>
          </div>
        </button>

        {/* RIGHT: CREDITS + PROFILE */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* CREDITS */}
          <div className="relative" ref={creditsRef}>
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  setShowAuthModal(true);
                  setShowCredits(false);
                  setShowProfile(false);
                  return;
                }

                setShowCredits((prev) => !prev);
                setShowProfile(false);
              }}
              className={`flex items-center gap-2 rounded-full border px-3 py-2 transition-all duration-200 ${
                showCredits
                  ? "border-gray-400 bg-gray-100"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
              }`}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm">
                <Coins size={15} className="text-gray-800" />
              </div>

              <span className="text-sm font-semibold tabular-nums text-gray-900">
                {credits}
              </span>

              <ChevronDown
                size={14}
                className={`hidden text-gray-500 transition-transform sm:block ${
                  showCredits ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* CREDIT POPUP */}
            {showCredits && (
              <div className="absolute right-0 top-14 z-50 w-72 origin-top-right rounded-2xl border border-gray-100 bg-white p-5 shadow-xl shadow-black/10 animate-in fade-in zoom-in-95 duration-150">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                  <Sparkles size={20} className="text-gray-900" />
                </div>

                <h3 className="text-sm font-bold text-gray-950">
                  Need more credits?
                </h3>

                <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                  Get more credits to continue your AI-powered interviews and
                  improve your interview preparation.
                </p>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2.5">
                  <span className="text-xs text-gray-500">
                    Available credits
                  </span>

                  <span className="text-sm font-bold text-gray-900">
                    {credits}
                  </span>
                </div>

                <button
                  onClick={handleBuyCredits}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-gray-800 active:scale-[0.98]"
                >
                  Buy More Credits
                  <ArrowUpRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  setShowAuthModal(true);
                  setShowProfile(false);
                  setShowCredits(false);
                  return;
                }

                setShowProfile((prev) => !prev);
                setShowCredits(false);
              }}
              aria-label="Open profile menu"
              aria-expanded={showProfile}
              className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full transition-all duration-200 ${
                isLoggedIn
                  ? "bg-black text-white hover:bg-gray-800"
                  : "border border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {isLoggedIn ? (
                <span className="text-sm font-semibold">{userInitial}</span>
              ) : (
                <Bot size={21} />
              )}
            </button>

            {/* PROFILE POPUP */}
            {showProfile && (
              <div className="absolute right-0 top-14 z-50 w-64 origin-top-right overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-black/10 animate-in fade-in zoom-in-95 duration-150">
                {isLoggedIn ? (
                  <>
                    {/* USER DETAILS */}
                    <div className="border-b border-gray-100 px-4 py-4">
                      <p className="text-sm font-bold text-gray-950">
                        {userName}
                      </p>

                      <p className="mt-1 truncate text-xs text-gray-500">
                        {userdata.email}
                      </p>

                      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1">
                        <Coins size={12} />
                        <span className="text-xs font-semibold text-gray-700">
                          {credits} credits
                        </span>
                      </div>
                    </div>

                    {/* MENU ITEMS */}
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setShowProfile(false);
                          navigate("/history");
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-black"
                      >
                        <History size={17} />
                        Interview History
                      </button>

                      <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <LogOut size={17} />
                        {loggingOut ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                        <Bot size={22} />
                      </div>

                      <h3 className="text-sm font-bold text-gray-950">
                        Welcome to VELTO
                      </h3>

                      <p className="mt-1 text-xs leading-relaxed text-gray-500">
                        Sign in to access your interviews, credits and
                        personalized dashboard.
                      </p>

                      <button
                        onClick={() => {
                          setShowProfile(false);
                          navigate("/auth");
                        }}
                        className="mt-4 w-full rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                      >
                        Sign In
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
      {showAuthModal && (
        <Auth isModal={true} onClose={() => setShowAuthModal(false)} />
      )}
    </header>
  );
};

export default Navbar;
