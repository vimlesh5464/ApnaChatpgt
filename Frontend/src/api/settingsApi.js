const BASE_URL = "http://127.0.0.1:8000/api";

const getToken = () => localStorage.getItem("token");

// ---------------- GET SETTINGS ----------------
export const getSettings = async () => {
  const token = getToken();

  if (!token) throw new Error("No token found");

  const res = await fetch(`${BASE_URL}/settings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch settings");
  }

  return res.json();
};

// ---------------- SAVE SETTINGS ----------------
export const saveSettings = async (data) => {
  const token = getToken();

  if (!token) throw new Error("No token found");

  const res = await fetch(`${BASE_URL}/settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to save settings");
  }

  return res.json();
};