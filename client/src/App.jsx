import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import { useEffect } from "react";
import axios from "axios";
const SERVERURL = import.meta.env.VITE_SERVER_URL;
function App() {
  useEffect(() => {
    const getuser = async () => {
      try {
        const result = await axios.get(SERVERURL + "/api/user/current-user", {
          withCredentials: true,
        });
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    };
    getuser()
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
}

export default App;
