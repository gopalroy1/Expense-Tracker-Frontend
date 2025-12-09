import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // If user already logged in → redirect to dashboard
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const goToLogin = () => navigate("/login");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-16 px-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        ExpenseTrack — Your Personal Finance Hub
      </h1>

      <p className="text-lg text-gray-600 max-w-2xl text-center leading-relaxed mb-10">
        ExpenseTrack helps you take full control of your finances.  
        Track your daily expenses, monitor your spending habits,  
        calculate your net worth, create custom budgets, view  
        month-over-month analytics, and make smarter financial decisions.
      </p>

      <div className="flex flex-col gap-6 items-center">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <FeatureCard 
            title="💸 Track Every Expense" 
            desc="Easily record and categorize your daily spending."
          />
          <FeatureCard
            title="📊 Monthly Insights"
            desc="Visualize how your money moves every month with charts."
          />
          <FeatureCard
            title="💰 Net Worth Tracking"
            desc="Understand your overall financial position in seconds."
          />
          <FeatureCard
            title="📅 Automatic Budgeting"
            desc="Set monthly budgets and never overspend again."
          />
          <FeatureCard
            title="⚡ Fast & Secure"
            desc="Privacy-focused. Your financial data stays yours."
          />
          <FeatureCard
            title="🌍 Access From Anywhere"
            desc="Works on web, mobile, and any modern browser."
          />
        </div>

        <button
          onClick={goToLogin}
          className="mt-8 px-8 py-3 bg-blue-600 text-white text-lg rounded-lg shadow hover:bg-blue-700 transition"
        >
          {token ? "Go to Dashboard" : "Login / Get Started"}
        </button>
      </div>
    </div>
  );
}

function FeatureCard({ title, desc }:any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">{title}</h2>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}
