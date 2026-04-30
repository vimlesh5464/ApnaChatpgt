const BASE_URL = "http://127.0.0.1:8000/api";

// ---------------- CHAT ----------------
export const sendMessage = async (threadId, message) => {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ threadId, message }),
  });

  return res.json();
};

// ---------------- THREADS ----------------
export const getThreads = async () => {
  const res = await fetch(`${BASE_URL}/thread`);
  return res.json();
};

export const getThreadMessages = async (threadId) => {
  const res = await fetch(`${BASE_URL}/thread/${threadId}`);
  return res.json();
};

export const deleteThread = async (threadId) => {
  const res = await fetch(`${BASE_URL}/thread/${threadId}`, {
    method: "DELETE",
  });

  return res.json();
};