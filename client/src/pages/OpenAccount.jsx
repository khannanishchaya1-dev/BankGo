import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createAccount } from "../features/accountSlice";

export default function OpenAccount() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [status, setStatus] = useState("form"); 
  // form | loading | success | error

  const [generatedAccount, setGeneratedAccount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    aadhaar: "",
    pan: "",
    phone: "",
    mpin: "",
    accountType: "Savings",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanAadhaar = form.aadhaar.replace(/\s/g, "");
    if (cleanAadhaar.length !== 12) {
      alert("Please enter a valid 12-digit Aadhaar number.");
      return;
    }

    if (form.mpin.length !== 4) {
      alert("MPIN must be exactly 4 digits.");
      return;
    }

    try {
      setStatus("loading");

      const result = await dispatch(createAccount(form)).unwrap();

      setGeneratedAccount(result);
      setStatus("success");

    } catch (error) {
      setErrorMessage(error || "Something went wrong");
      setStatus("error");
    }
  };

  /* ================= LOADING ================= */

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-pink-400 rounded-full animate-spin mx-auto"></div>
          <h2 className="mt-6 text-xl font-semibold">
            Creating Your Account
          </h2>
          <p className="text-indigo-300 text-sm mt-2">
            Please wait while we process your request...
          </p>
        </div>
      </div>
    );
  }

  /* ================= SUCCESS ================= */

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center px-6 text-white">

        <div className="max-w-md w-full text-center">

          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✓</span>
          </div>

          <h2 className="text-2xl font-semibold">
            Account Created Successfully
          </h2>

          <p className="text-indigo-200 text-sm mt-3">
            Your BankGo account is now active.
          </p>

          <div className="mt-8 border border-white/20 rounded-2xl p-6">

            <p className="text-xs text-indigo-300 uppercase tracking-wider">
              Account Number
            </p>

            <p className="text-2xl font-bold tracking-widest mt-3">
              {generatedAccount.accountNumber}
            </p>

            <p className="text-xs text-indigo-300 mt-2">
              Account Type: {form.accountType}
            </p>

          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-8 w-full bg-pink-500 hover:bg-pink-600 transition-all duration-300 py-3 rounded-2xl font-semibold"
          >
            Go to Dashboard
          </button>

        </div>

      </div>
    );
  }

  /* ================= ERROR ================= */

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center px-6 text-white">

        <div className="max-w-md w-full text-center">

          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✕</span>
          </div>

          <h2 className="text-2xl font-semibold">
            Account Creation Failed
          </h2>

          <p className="text-indigo-200 text-sm mt-3">
            {errorMessage}
          </p>

          <button
            onClick={() => setStatus("form")}
            className="mt-8 w-full bg-pink-500 hover:bg-pink-600 transition-all duration-300 py-3 rounded-2xl font-semibold"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  /* ================= FORM ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white px-6 py-10">

      <div className="text-center mb-10">
        <p className="text-xs tracking-widest text-indigo-300 uppercase">
          BankGo
        </p>
        <h1 className="text-2xl font-semibold mt-2">
          Open a New Account
        </h1>
        <p className="text-indigo-200 text-sm mt-2">
          Secure • Fast • Fully Digital
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto space-y-5"
      >

        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          required
          placeholder="Full Name"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:ring-2 focus:ring-pink-400 outline-none"
        />

        <input
          type="text"
          name="aadhaar"
          value={form.aadhaar}
          onChange={(e) => {
            let value = e.target.value.replace(/\D/g, "");
            value = value.substring(0, 12);
            const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
            setForm({ ...form, aadhaar: formatted });
          }}
          required
          placeholder="Aadhaar Number"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:ring-2 focus:ring-pink-400 outline-none"
        />

        <input
          type="text"
          name="pan"
          value={form.pan}
          onChange={(e) => {
            let value = e.target.value.toUpperCase();
            value = value.replace(/[^A-Z0-9]/g, "");
            value = value.substring(0, 10);
            setForm({ ...form, pan: value });
          }}
          required
          placeholder="PAN Number"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:ring-2 focus:ring-pink-400 outline-none"
        />

        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          placeholder="Phone Number"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:ring-2 focus:ring-pink-400 outline-none"
        />

        <input
          type="password"
          name="mpin"
          value={form.mpin}
          onChange={(e) => {
            let value = e.target.value.replace(/\D/g, "");
            value = value.substring(0, 4);
            setForm({ ...form, mpin: value });
          }}
          required
          placeholder="4-digit MPIN"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:ring-2 focus:ring-pink-400 outline-none"
        />

        <select
  name="accountType"
  value={form.accountType}
  onChange={handleChange}
  className="w-full appearance-none px-4 py-3 rounded-xl 
             bg-white/5 
             border border-white/15
             focus:ring-2 focus:ring-pink-400 
             focus:border-transparent
             outline-none transition-all duration-300"
>
  <option value="Savings" className="text-black">
    Savings Account
  </option>
  <option value="Current" className="text-black">
    Current Account
  </option>
  <option value="FixedDeposit" className="text-black">
    Fixed Deposit (FD)
  </option>
  <option value="RecurringDeposit" className="text-black">
    Recurring Deposit (RD)
  </option>
</select>
<div className="bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-3 text-xs text-yellow-200"> ⚠ If you already hold a BankGo account of any type, you cannot open a new account of that type here. Please contact customer support for additional services. </div>

        <button
          type="submit"
          className="w-full bg-pink-500 hover:bg-pink-600 transition-all duration-300 py-3 rounded-2xl font-semibold"
        >
          Submit Application
        </button>

      </form>

    </div>
  );
}