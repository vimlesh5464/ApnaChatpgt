const BASE_URL = "http://127.0.0.1:8000/api";

// ---------------- SAFE RESPONSE HANDLER ----------------
const handleResponse = async (res) => {
  const contentType = res.headers.get("content-type");

  // ❌ if request failed
  if (!res.ok) {
    let errorMessage = "Something went wrong";

    if (contentType && contentType.includes("application/json")) {
      const errorData = await res.json().catch(() => ({}));
      errorMessage = errorData.detail || errorData.message || errorMessage;
    }

    throw new Error(errorMessage);
  }

  // ✅ handle empty responses (important for DELETE APIs)
  if (res.status === 204) {
    return null;
  }

  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }

  return null;
};

// ---------------- CHAT ----------------
export const sendMessage = async (threadId, message) => {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ threadId, message }),
  });

  return handleResponse(res);
};

// ---------------- THREADS ----------------
export const getThreads = async () => {
  const res = await fetch(`${BASE_URL}/thread`);
  return handleResponse(res);
};

export const getThreadMessages = async (threadId) => {
  if (!threadId) throw new Error("threadId is required");

  const res = await fetch(`${BASE_URL}/thread/${threadId}`);
  return handleResponse(res);
};

// ---------------- DELETE THREAD (FIXED) ----------------
export const deleteThread = async (threadId) => {
  if (!threadId) throw new Error("threadId is required");

  const res = await fetch(`${BASE_URL}/thread/${threadId}`, {
    method: "DELETE",
  });

  return handleResponse(res);
};