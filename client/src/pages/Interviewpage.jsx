
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Setup from "../components/Setup";
import Interview from "../components/Interview";
import Report from "../components/Report";
import Navbar from "../components/Navbar";
import { setuserdata } from "../redux/userslice";
import { API_URL } from "../config/api";
const STORAGE_KEY = "velto_interview_progress";

const getSavedProgress = () => {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

const Interviewpage = () => {
  const [savedProgress] = useState(getSavedProgress);

  const [step, setstep] = useState(savedProgress?.step || 1);
  const [interviewdata, setinterviewdata] = useState(
    savedProgress?.interviewdata || null
  );

  const { userdata } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Persist the current interview stage and data.
  useEffect(() => {
    if (step === 1 && !interviewdata) {
      sessionStorage.removeItem(STORAGE_KEY);
      return;
    }

    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        step,
        interviewdata,
      })
    );
  }, [step, interviewdata]);

  const startInterview = async (setupData) => {
    const response = await axios.post(
      `${API_URL}/api/resume/generate-questions`,
      setupData,
      { withCredentials: true }
    );

    const result = response.data?.data;
    const interview = result?.interview;

    const interviewId =
      result?.interviewId ?? interview?._id ?? result?._id;

    const questions = result?.questions ?? interview?.questions;

    if (
      !interviewId ||
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      throw new Error(
        "The server did not return a valid interview ID and its questions."
      );
    }

    // Backend must return the updated credit balance.
    const creditsLeft = Number.isFinite(result?.creditsLeft)
      ? result.creditsLeft
      : userdata?.credit;

    const nextInterviewData = {
      interviewId: String(interviewId),
      userName: userdata?.name || "Candidate",
      creditsLeft,
      role: setupData.role,
      experience: setupData.experience,
      mode: setupData.mode,
      questions,
      currentQuestionIndex: 0,
    };

    // Update Redux immediately.
    if (Number.isFinite(creditsLeft) && userdata) {
      dispatch(
        setuserdata({
          ...userdata,
          credit: creditsLeft,
        })
      );
    }

    setinterviewdata(nextInterviewData);
    setstep(2);
  };

  const finishInterview = (report) => {
    setinterviewdata(report);
    setstep(3);
  };

  const restartInterview = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setinterviewdata(null);
    setstep(1);
  };

  return (
    <div>
      <Navbar />
      {step === 1 && <Setup onStart={startInterview} />}

      {step === 2 && interviewdata && (
        <Interview
          interviewdata={interviewdata}
          onFinish={finishInterview}
        />
      )}

      {step === 3 && (
        <Report
          report={interviewdata}
          onRestart={restartInterview}
        />
      )}
    </div>
  );
};

export default Interviewpage;
