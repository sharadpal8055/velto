import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setuserdata } from "./redux/userslice";
import Interviewpage from "./pages/Interviewpage";
import InterviewHistory from "./pages/InterviewHistory";
import InterviewReport from "./pages/InterviewReport";
import Pricing from "./pages/Pricing";
import { API_URL } from "./config/api";
// import Interviewpage from "./pages/Interviewpage";
function App() {
  const dispatch=useDispatch()
  useEffect(() => {
    const getuser = async () => {
      try {
        const result = await axios.get(`${API_URL}/api/user/current-user`, {
          withCredentials: true,
        });
        dispatch(setuserdata(result.data.user))
      } catch (error) {
        dispatch(setuserdata(null))
      }
    };
    getuser()
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/interviews" element={<Interviewpage />} />
      <Route path="/interviews/:interviewId/report" element={<InterviewReport />} />
      <Route path="/history" element={<InterviewHistory />} />
      <Route path="/pricing" element={<Pricing />} />
      {/* <Route path="/interviews" element={<Interviews />} />
<Route path="/history" element={<History />} /> */}
    </Routes>
  );
}

export default App;
