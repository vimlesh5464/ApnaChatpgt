import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import {
  getThreads,
  getThreadMessages,
  deleteThread,
} from "./api/chatApi";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  // ---------------- LOAD THREADS ----------------
  const loadThreads = async () => {
    try {
      const data = await getThreads();

      const formatted = data.map((t) => ({
        threadId: t.thread_id,
        title: t.title,
      }));

      setAllThreads(formatted);
    } catch (err) {
      console.log("Load Threads Error:", err.message);
    }
  };

  useEffect(() => {
    loadThreads();
  }, [currThreadId]);

  // ---------------- NEW CHAT ----------------
  const createNewChat = () => {
    const newId = uuidv1();

    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(newId);
    setPrevChats([]);
  };

  // ---------------- SWITCH THREAD ----------------
  const changeThread = async (threadId) => {
    if (!threadId) return;

    setCurrThreadId(threadId);

    try {
      const data = await getThreadMessages(threadId);

      setPrevChats(data);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log("Thread Load Error:", err.message);
    }
  };

  // ---------------- DELETE THREAD ----------------
  const removeThread = async (threadId) => {
    if (!threadId) return;

    try {
      await deleteThread(threadId);

      // remove from UI
      setAllThreads((prev) =>
        prev.filter((t) => t.threadId !== threadId)
      );

      // if current thread deleted → reset state
      if (threadId === currThreadId) {
        setCurrThreadId(null);
        setPrevChats([]);
        setReply(null);
        setNewChat(true);
      }
    } catch (err) {
      console.log("Delete Error:", err.message);
    }
  };

  return (
    <section className="sidebar">

      {/* NEW CHAT BUTTON */}
      <button onClick={createNewChat}>
        <img
          src="src/assets/blacklogo.png"
          alt="gpt logo"
          className="logo"
        />
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      {/* THREAD LIST */}
      <ul className="history">
        {allThreads?.map((thread) => (
          <li
            key={thread.threadId}
            onClick={() => changeThread(thread.threadId)}
            className={
              thread.threadId === currThreadId ? "highlighted" : ""
            }
          >
            {thread.title}

            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation();
                removeThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      {/* FOOTER */}
      <div className="sign">
        <p>By Vimlesh Gupta ♥</p>
      </div>
    </section>
  );
}

export default Sidebar;