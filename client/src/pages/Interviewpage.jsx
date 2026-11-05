import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Setup from "../components/Setup";
import Interview from "../components/Interview";
import Report from "../components/Report";
import { setuserdata } from "../redux/userslice";

const API_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8055";

const Interviewpage = () => {
  const [step, setstep] = useState(1);
  const [interviewdata, setinterviewdata] = useState(null);
  const { userdata } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const startInterview = async (setupData) => {
    const response = await axios.post(
      `${API_URL}/api/resume/generate-questions`,
      setupData,
      { withCredentials: true },
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
        "The server did not return a valid interview ID and its questions.",
      );
    }

    const creditsLeft = Number.isFinite(result.creditsLeft)
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
    };

    console.log("Interview step 2 data:", nextInterviewData);

    if (Number.isFinite(creditsLeft) && userdata) {
      dispatch(setuserdata({ ...userdata, credit: creditsLeft }));
    }

    setinterviewdata(nextInterviewData);
    setstep(2);
  };

  return (
    <div>
      {step === 1 && <Setup onStart={startInterview} />}
      {step === 2 && (
        <Interview
          interviewdata={interviewdata}
          onfinish={(report) => {
            setinterviewdata(report);
            setstep(3);
          }}
        />
      )}
      {step === 3 && (
        <Report
          report={interviewdata}
          onRestart={() => {
            setinterviewdata(null);
            setstep(1);
          }}
        />
      )}
    </div>
  );
};

export default Interviewpage;
