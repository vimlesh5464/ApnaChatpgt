import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useRef, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import { sendMessage, sendVoice } from "./api/chatApi";
import { useNavigate } from "react-router-dom";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat,
    theme,
    toggleTheme,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recording, setRecording] = useState(false);

  const menuRef = useRef(null);
  const chunksRef = useRef([]);
  const navigate = useNavigate();

  // ---------------- CLOSE DROPDOWN ----------------
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ---------------- CHAT ----------------
  const getReply = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setNewChat(false);

    try {
      const data = await sendMessage(currThreadId, prompt);

      setReply(data.reply);

      setPrevChats((prev) => [
        ...prev,
        { role: "user", content: prompt },
        { role: "assistant", content: data.reply },
      ]);

      setPrompt("");
    } catch (err) {
      console.log("Chat Error:", err.message);
    }

    setLoading(false);
  };

  // ---------------- VOICE ----------------
  const startRecording = async () => {
    try {
      setRecording(true);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        try {
          if (chunksRef.current.length === 0) {
            console.log("No audio recorded");
            return;
          }

          setLoading(true);

          // 🔥 AUDIO BLOB
          const audioBlob = new Blob(chunksRef.current, {
            type: "audio/webm", // or "audio/wav"
          });

          // 🔥 STOP MIC
          stream.getTracks().forEach((track) => track.stop());

          const data = await sendVoice(audioBlob);

          setReply(data.reply);

          setPrevChats((prev) => [
            ...prev,
            { role: "user", content: data.transcription },
            { role: "assistant", content: data.reply },
          ]);

          setPrompt("");
        } catch (err) {
          console.log("Voice Error:", err.message);
        } finally {
          setLoading(false);
          setRecording(false);
          chunksRef.current = [];
        }
      };

      recorder.start();

      // ⏱️ AUTO STOP (4 sec)
      setTimeout(() => {
        if (recorder.state !== "inactive") {
          recorder.stop();
        }
      }, 4000);

    } catch (err) {
      console.log("Mic Error:", err.message);
      setRecording(false);
    }
  };

  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    setIsOpen(false);
    localStorage.removeItem("token");
    setPrompt("");
    setReply(null);
    setPrevChats([]);
    setNewChat(true);
    navigate("/login");
  };

  return (
    <div className="chatWindow">

      {/* NAVBAR */}
      <div className="navbar">
        <span>
          SigmaGPT <i className="fa-solid fa-chevron-down"></i>
        </span>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          
          {/* THEME */}
          <button className="themeToggleBtn" onClick={toggleTheme}>
            {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </button>

          {/* USER */}
          <div className="userIconDiv" onClick={() => setIsOpen(!isOpen)}>
            <span className="userIcon">
              <i className="fa-solid fa-user"></i>
            </span>
          </div>

        </div>
      </div>

      {/* DROPDOWN */}
      {isOpen && (
        <div className="dropDown" ref={menuRef}>
          <div className="dropDownItem" onClick={() => navigate("/settings")}>
            <i className="fa-solid fa-gear"></i> Settings
          </div>

          <div className="dropDownItem" onClick={() => navigate("/upgrade")}>
            <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade Plan
          </div>

          <div className="dropDownItem danger" onClick={handleLogout}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
          </div>
        </div>
      )}

      {/* CHAT */}
      <Chat />

      {/* LOADER */}
      <ScaleLoader color="#fff" loading={loading} />

      {/* INPUT */}
      <div className="chatInput">
        <div className="inputBox">

          <input
            value={prompt}
            disabled={loading}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getReply()}
            placeholder="Ask anything..."
          />

          {/* SEND */}
          <button id="submit" onClick={getReply} disabled={loading}>
            <i className="fa-solid fa-paper-plane"></i>
          </button>

          {/* 🎤 VOICE */}
          <button
            className="micBtn"
            onClick={startRecording}
            disabled={loading || recording}
            title="Speak"
          >
            {recording ? "🎙️ Recording..." : "🎤"}
          </button>

        </div>

        <p className="info">
          SigmaGPT can make mistakes. Check important info.
        </p>
      </div>

    </div>
  );
}

export default ChatWindow;