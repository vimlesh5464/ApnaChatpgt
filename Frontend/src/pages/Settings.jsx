import { useContext, useEffect, useState } from "react";
import { MyContext } from "../MyContext";
import { getSettings, saveSettings } from "../api/settingsApi";
import "./Settings.css";

function Settings() {
  const { theme, toggleTheme } = useContext(MyContext);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [notification, setNotification] = useState(true);
  const [loading, setLoading] = useState(false);

  // ---------------- LOAD SETTINGS ----------------
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();

        setProfile({
          name: data?.name || "",
          email: data?.email || "",
        });

        setNotification(data?.notifications ?? true);
      } catch (err) {
        console.log("Load settings error:", err.message);
      }
    };

    loadSettings();
  }, []);

  // ---------------- SAVE SETTINGS ----------------
  const handleSave = async () => {
    setLoading(true);

    try {
      await saveSettings({
        name: profile.name,
        email: profile.email,
        theme,
        notifications: notification,
      });

      alert("Settings saved ✅");
    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="settings-container">
      <div className="settings-box">

        <h2>⚙️ Settings</h2>

        {/* PROFILE */}
        <div className="card">
          <h3>Profile</h3>

          <input
            value={profile.name || ""}
            onChange={(e) =>
              setProfile({ ...profile, name: e.target.value })
            }
          />

          <input
            value={profile.email || ""}
            onChange={(e) =>
              setProfile({ ...profile, email: e.target.value })
            }
          />

          <button className="btn" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </div>

        {/* THEME */}
        <div className="card">
          <h3>Appearance</h3>

          <div className="row">
            <span>Theme</span>

            <button className="toggle" onClick={toggleTheme}>
              {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
            </button>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div className="card">
          <h3>Notifications</h3>

          <div className="row">
            <span>Enable Notifications</span>

            <button
              className={`toggle ${notification ? "on" : "off"}`}
              onClick={() => setNotification(!notification)}
            >
              {notification ? "ON 🔔" : "OFF 🔕"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Settings;