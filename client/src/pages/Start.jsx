import React from "react";
import { useNavigate } from "react-router-dom";

export default function Start() {
  const navigate = useNavigate();

  return (
    <div
      className="h-[100dvh] bg-cover bg-center relative flex flex-col justify-end"
      style={{ backgroundImage: "url('/bank-bg.avif')" }}
    >
      {/* Dark Overlay */}
      {/* Dark Overlay */}
<div className="absolute inset-0 bg-black/40"></div>

      {/* Bottom Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl rounded-t-3xl px-6 py-8 text-white shadow-2xl">

        <h2 className="text-2xl font-bold mb-2">
          Welcome to <span className="text-pink-400">BankGo</span>
        </h2>

        <p className="text-sm text-gray-200 mb-6">
          Secure. Fast. Digital Banking Experience.
        </p>

        {/* New Customer */}
        <button
          onClick={() => navigate("/register")}
          className="w-full bg-pink-500 active:scale-95 transition-transform duration-200 py-3.5 rounded-2xl font-semibold shadow-lg text-sm"
        >
          New Customer — Start Your Banking Experience
        </button>

        {/* Already Customer */}
        <button
          onClick={() => navigate("/login")}
          className="w-full mt-4 border border-white/40 active:scale-95 transition-transform duration-200 py-3.5 rounded-2xl font-semibold text-sm"
        >
          Already a Customer? Login
        </button>

      </div>
    </div>
  );
}