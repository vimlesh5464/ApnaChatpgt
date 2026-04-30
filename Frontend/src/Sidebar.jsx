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

  const loadThreads = async () => {
    try {
      const data = await getThreads();

      const filtered = data.map((t) => ({
        threadId: t.thread_id,
        title: t.title,
      }));

      setAllThreads(filtered);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (threadId) => {
    setCurrThreadId(threadId);

    try {
      const data = await getThreadMessages(threadId);

      setPrevChats(data);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  const removeThread = async (threadId) => {
    try {
      await deleteThread(threadId);

      setAllThreads((prev) =>
        prev.filter((t) => t.threadId !== threadId)
      );

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="sidebar">
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

      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li
            key={idx}
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

      <div className="sign">
        <p>By Vimlesh Gupta &hearts;</p>
      </div>
    </section>
  );
}

export default Sidebar;