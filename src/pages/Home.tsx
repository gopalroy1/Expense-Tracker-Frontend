
import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      {/* ---------------- HERO ---------------- */}
      <section className="max-w-6xl mx-auto px-6 pt-28 pb-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          Take Control of Your <span className="text-blue-600">Money</span>,
          <br /> Without the Stress
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Expense Tracker helps you understand where your money goes,
          track net worth over time, and make smarter financial decisions —
          all in one simple dashboard.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/signup"
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Get Started Free
          </Link>

          <Link
            to="/login"
            className="px-6 py-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition"
          >
            Login
          </Link>
          <Link
            to="/demo"
            className="px-6 py-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition"
          >
            View Live Demo
          </Link>
        </div>
      </section>

      {/* ---------------- BENEFITS ---------------- */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Why use Expense Tracker?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "See the full picture",
              desc: "Track bank accounts, credit cards, investments, and loans together to understand your real net worth.",
            },
            {
              title: "Trends, not just numbers",
              desc: "Visual dashboards show how your finances change month by month, so you spot problems early.",
            },
            {
              title: "Built for clarity",
              desc: "No clutter, no spreadsheets. Just clean insights that help you make confident decisions.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl border shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="bg-white border-t border-b border-gray-200 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center mb-12">
            How it works
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                step: "1",
                title: "Add your financial data",
                desc: "Enter balances for bank accounts, credit cards, investments, and loans.",
              },
              {
                step: "2",
                title: "Track snapshots over time",
                desc: "Each month, update balances to build a clear financial timeline.",
              },
              {
                step: "3",
                title: "Understand & improve",
                desc: "Use trends and breakdowns to reduce debt, grow assets, and plan better.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FUTURE VISION ---------------- */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-semibold text-center mb-12">
          What’s coming next
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "AI-powered insights",
              desc: "Automatic analysis of your spending and net worth trends, with clear suggestions.",
            },
            {
              title: "Smart budget planning",
              desc: "Set goals and let the system guide you with adaptive budgets.",
            },
            {
              title: "Predictive reports",
              desc: "Understand where your finances are heading before problems arise.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl border shadow-sm p-6"
            >
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="bg-blue-600 text-white py-20 text-center">
        <h2 className="text-3xl font-semibold mb-4">
          Start understanding your money today
        </h2>
        <p className="text-blue-100 mb-8">
          It’s free to get started. No credit card required.
        </p>

        <Link
          to="/signup"
          className="px-8 py-3 rounded-lg bg-white text-blue-600 font-medium hover:bg-blue-50 transition"
        >
          Create your account
        </Link>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="text-center text-sm text-gray-500 py-6">
        © {new Date().getFullYear()} Expense Tracker. All rights reserved.
      </footer>
    </div>
  );
};
export default Home