import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) navigate("/dashboard");
  }, [token, navigate]);

  const goToLogin = () => navigate("/login");

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-white to-blue-100 flex flex-col items-center overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-300 opacity-20 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-10 right-0 w-72 h-72 bg-blue-300 opacity-20 rounded-full blur-3xl -z-10 animate-ping"></div>
      <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-purple-300 opacity-30 rounded-full blur-2xl -z-10 animate-bounce"></div>

      {/* HERO SECTION */}
      <section className="mt-24 text-center px-6 max-w-3xl max-w-6xl px-6 pb-20 mt-24 text-center px-6 max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight"
        >
          Take Control of Your <span className="text-blue-600">Finances</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed mb-10"
        >
          ExpenseTrack helps you manage expenses, visualize spending patterns, track net worth, and build better financial habits — all in one place.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          onClick={goToLogin}
          className="mb-20 px-10 py-4 bg-blue-600 text-white text-lg rounded-xl shadow-xl hover:bg-blue-700 transition"
        >
          {token ? "Go to Dashboard" : "Start Tracking Now"}
        </motion.button>

        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">What You Can Do with ExpenseTrack</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <FeatureCard title="💸 Track Every Expense" desc="Log and categorize your daily expenses effortlessly." />
          <FeatureCard title="📊 Smart Insights" desc="Analytics that understand your habits." />
          <FeatureCard title="💰 Net Worth Tracking" desc="Monitor your assets, liabilities, and overall wealth." />
          <FeatureCard title="📅 Automated Budgeting" desc="Set monthly budgets with real-time tracking." />
          <FeatureCard title="🔔 Smart Alerts" desc="Get notified about overspending or budget limits." />
          <FeatureCard title="🌍 Access Anywhere" desc="Works seamlessly on mobile, tablet, and desktop." />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, desc }:any) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition transform hover:-translate-y-1 cursor-pointer"
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-base">{desc}</p>
    </motion.div>
  );
}
