import "./Upgrade.css";
import { useNavigate } from "react-router-dom";

function Upgrade() {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free",
      price: "₹0",
      features: ["Basic chat", "Limited usage", "Standard speed"],
      button: "Current Plan",
      disabled: true,
    },
    {
      name: "Pro",
      price: "₹199/month",
      features: ["Unlimited chat", "Faster responses", "Voice support", "Priority access"],
      button: "Upgrade to Pro",
      disabled: false,
    },
    {
      name: "Ultra",
      price: "₹499/month",
      features: ["Everything in Pro", "AI Agents", "Advanced tools", "Early features access"],
      button: "Go Ultra",
      disabled: false,
    },
  ];

  return (
    <div className="upgrade-container">

      <h1>🚀 Upgrade Your Plan</h1>
      <p className="sub">
        Unlock more power with SigmaGPT premium plans
      </p>

      <div className="plans">

        {plans.map((plan, idx) => (
          <div key={idx} className="plan-card">

            <h2>{plan.name}</h2>
            <h3>{plan.price}</h3>

            <ul>
              {plan.features.map((f, i) => (
                <li key={i}>✔ {f}</li>
              ))}
            </ul>

            <button
              disabled={plan.disabled}
              onClick={() => navigate("/checkout")}
              className={plan.disabled ? "disabled-btn" : "btn"}
            >
              {plan.button}
            </button>

          </div>
        ))}

      </div>
    </div>
  );
}

export default Upgrade;