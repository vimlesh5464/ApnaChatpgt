import "./App.css";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState, useEffect } from "react";
import { v1 as uuidv1 } from "uuid";

import { Routes, Route, Navigate } from "react-router-dom";
import Settings from "./pages/Settings.jsx";
import Upgrade from "./pages/Upgrade.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

/* 🔒 Protected Route */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  /* 🌗 THEME STATE */
  const [theme, setTheme] = useState("dark");

  /* Load saved theme */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      setTheme(savedTheme);
      document.body.setAttribute("data-theme", savedTheme);
    } else {
      document.body.setAttribute("data-theme", "dark");
    }
  }, []);

  /* Toggle theme */
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    setTheme(newTheme);
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewChat,
    prevChats,
    setPrevChats,
    allThreads,
    setAllThreads,
    theme,
    toggleTheme,
  };

  return (
    <MyContext.Provider value={providerValues}>
      <div className="app">

        <Routes>

          {/* 🔐 LOGIN */}
          <Route
            path="/login"
            element={
              localStorage.getItem("token")
                ? <Navigate to="/" />
                : <Login />
            }
          />

          {/* 🔐 REGISTER */}
          <Route
            path="/register"
            element={
              localStorage.getItem("token")
                ? <Navigate to="/" />
                : <Register />
            }
          />

          {/* 🧠 CHAT APP (PROTECTED) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <>
                  <Sidebar />
                  <ChatWindow />
                </>
              </ProtectedRoute>
            }
          />

          {/* SETTINGS */}
          <Route path="/settings" element={<Settings />} />

          {/* UPGRADE */}
          <Route path="/upgrade" element={<Upgrade />} />

          {/* 🚨 FALLBACK */}
          <Route path="*" element={<Navigate to="/login" />} />

        </Routes>

      </div>
    </MyContext.Provider>
  );
}

export default App;