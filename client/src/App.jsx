import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setuserdata } from "./redux/userslice";
const SERVERURL = import.meta.env.VITE_SERVER_URL;

function App() {
  const dispatch=useDispatch()
  useEffect(() => {
    const getuser = async () => {
      try {
        const result = await axios.get(SERVERURL + "/api/user/current-user", {
          withCredentials: true,
        });
        console.log(result);
        dispatch(setuserdata(result.data.user))
      } catch (error) {
        console.log(error);
        dispatch(setuserdata(null))
      }
    };
    getuser()
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      {/* <Route path="/interviews" element={<Interviews />} />
<Route path="/history" element={<History />} /> */}
    </Routes>
  );
}

export default App;
