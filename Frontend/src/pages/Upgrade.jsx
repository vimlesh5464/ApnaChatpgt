import "./Upgrade.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Upgrade() {
  const navigate = useNavigate();

  const [currentPlan] = useState("Free"); // later replace with backend/user context

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
      features: [
        "Unlimited chat",
        "Faster responses",
        "Voice support",
        "Priority access",
        "AI Image Generation 🖼️",
      ],
      button: "Upgrade to Pro",
      disabled: false,
    },
    {
      name: "Ultra",
      price: "₹499/month",
      features: [
        "Everything in Pro",
        "AI Agents",
        "Advanced tools",
        "Early feature access",
        "Priority support 🚀",
      ],
      button: "Go Ultra",
      disabled: false,
    },
  ];

  const handleUpgrade = (planName) => {
    navigate(`/checkout?plan=${planName.toLowerCase()}`);
  };

  return (
    <div className="upgrade-container">

      <h1>🚀 Upgrade Your Plan</h1>
      <p className="sub">
        Unlock more power with SigmaGPT premium plans
      </p>

      <div className="plans">

        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`plan-card ${
              plan.name === currentPlan ? "active-plan" : ""
            }`}
          >

            <h2>{plan.name}</h2>
            <h3>{plan.price}</h3>

            <ul>
              {plan.features.map((f, i) => (
                <li key={i} className="feature-item">
                  ✔ {f}
                </li>
              ))}
            </ul>

            <button
              disabled={plan.disabled || plan.name === currentPlan}
              onClick={() => handleUpgrade(plan.name)}
              className={
                plan.disabled || plan.name === currentPlan
                  ? "disabled-btn"
                  : "btn"
              }
            >
              {plan.name === currentPlan ? "Current Plan" : plan.button}
            </button>

          </div>
        ))}

      </div>
    </div>
  );
}

export default Upgrade;