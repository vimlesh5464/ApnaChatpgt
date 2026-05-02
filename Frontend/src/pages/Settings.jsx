import { useContext, useState } from "react";
import { MyContext } from "../MyContext";
import "./Settings.css";

function Settings() {
  const { theme, toggleTheme } = useContext(MyContext);

  const [profile, setProfile] = useState({
    name: "User",
    email: "user@gmail.com",
  });

  const [notification, setNotification] = useState(true);

  return (
    <div className="settings-container">

      <div className="settings-box">

        <h2>⚙️ Settings</h2>
        <p className="sub">Manage your account & preferences</p>

        {/* PROFILE SECTION */}
        <div className="card">
          <h3>Profile</h3>

          <input
            value={profile.name}
            onChange={(e) =>
              setProfile({ ...profile, name: e.target.value })
            }
            placeholder="Name"
          />

          <input
            value={profile.email}
            onChange={(e) =>
              setProfile({ ...profile, email: e.target.value })
            }
            placeholder="Email"
          />

          <button className="btn">Save Profile</button>
        </div>

        {/* THEME SECTION */}
        <div className="card">
          <h3>Appearance</h3>

          <div className="row">
            <span>Dark Mode</span>

            <button className="toggle" onClick={toggleTheme}>
              {theme === "dark" ? "ON 🌙" : "OFF ☀️"}
            </button>
          </div>
        </div>

        {/* NOTIFICATION */}
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