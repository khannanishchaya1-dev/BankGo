import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAccounts } from "../features/accountSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { optimisticDebit, rollbackDebit } from "../features/accountSlice";
export default function Transfer() {
  const [idempotencyKey, setIdempotencyKey] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [transactionId, setTransactionId] = useState(null);

  const { accounts } = useSelector((state) => state.account);

  const [step, setStep] = useState("form"); 
  // form | mpin | processing | success

  const [form, setForm] = useState({
    fromAccount: "",
    toAccount: "",
    amount: "",
    note: "",
    mpin: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
useEffect(() => {
  dispatch(fetchAccounts());
}, [dispatch]);
  const handleSend = (e) => {
    e.preventDefault();

    if (!form.fromAccount || !form.toAccount || !form.amount) {
      alert("Please fill all required fields");
      return;
    }

    setStep("mpin");
  };

 const handleConfirmTransfer = async () => {
  if (form.mpin.length !== 4) {
    alert("Enter valid MPIN");
    return;
  }

  const amount = Number(form.amount);

  try {
    // 🔥 Optimistically deduct balance immediately
    dispatch(
      optimisticDebit({
        accountId: form.fromAccount,
        amount,
      })
    );

    setStep("processing");

    // small UX delay so user feels smooth transition
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_API_URL}/api/transactions/transfer`,
      {
        fromAccount: form.fromAccount,
        toAccount: form.toAccount,
        amount,
        note: form.note,
        mpin: form.mpin,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Idempotency-Key": crypto.randomUUID(),
        },
      }
    );

    setTransactionId(response.data.transaction?._id);
    setStep("success");

  } catch (error) {

    // ❌ Rollback balance if transfer failed
    dispatch(
      rollbackDebit({
        accountId: form.fromAccount,
        amount,
      })
    );

    alert(error.response?.data?.message || "Transfer failed");
    setStep("form");
  }
};

  /* ================= PROCESSING SCREEN ================= */

  if (step === "processing") {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center px-6 text-white">

      <div className="text-center">

        {/* Animated Glow Ring */}
        <div className="relative w-28 h-28 mx-auto">

          <div className="absolute inset-0 rounded-full bg-pink-500/20 animate-ping"></div>

          <div className="w-28 h-28 rounded-full border-4 border-white/20 border-t-pink-400 animate-spin"></div>

        </div>

        {/* Title */}
        <h2 className="mt-8 text-2xl font-semibold tracking-wide">
          Processing Payment
        </h2>

        {/* Subtitle */}
        <p className="text-indigo-300 mt-3 text-sm">
          Securing your transaction...
        </p>

        {/* Animated Dots */}
        <div className="flex justify-center gap-2 mt-4">
          <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-150"></span>
          <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-300"></span>
        </div>

        {/* Transaction Preview */}
        <div className="mt-10 bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 shadow-2xl max-w-sm mx-auto">

          <p className="text-xs text-indigo-300 uppercase tracking-widest">
            Transferring Amount
          </p>

          <p className="text-3xl font-bold mt-3">
            ₹ {Number(form.amount).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>

          <p className="text-xs text-indigo-300 mt-3">
            Please do not close this screen
          </p>

        </div>

      </div>

    </div>
  );
}

  /* ================= SUCCESS SCREEN ================= */

  if (step === "success") {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center px-6 text-white">

      <div className="text-center max-w-md w-full">

        {/* Animated Success Circle */}
        <div className="relative w-24 h-24 mx-auto mb-6">

          <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping"></div>

          <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center border border-green-400/40">
            <span className="text-4xl">✓</span>
          </div>

        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold tracking-wide">
          Payment Successful
        </h2>

        <p className="text-indigo-300 mt-3 text-sm">
          Your transaction has been completed securely.
        </p>

        {/* Transaction Card */}
        <div className="mt-8 bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 shadow-2xl">

          <p className="text-xs text-indigo-300 uppercase tracking-widest">
            Amount Sent
          </p>

          <p className="text-3xl font-bold mt-3">
            ₹ {Number(form.amount).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>

          <p className="text-xs text-indigo-300 mt-4">
            To Account: {form.toAccount}
          </p>

          <p className="text-xs text-indigo-300 mt-2">
            Transaction ID: TXN{Date.now().toString().slice(-6)}
          </p>

        </div>

        {/* Go Home Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-8 w-full bg-pink-500 hover:bg-pink-600 transition-all duration-300 py-3 rounded-2xl font-semibold shadow-lg"
        >
          Go to Home
        </button>

      </div>

    </div>
  );
}


if (step === "error") {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center px-6 text-white">

      <div className="text-center max-w-md w-full">

        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-400/40">
          <span className="text-3xl">✕</span>
        </div>

        <h2 className="text-2xl font-semibold">
          Payment Failed
        </h2>

        <p className="text-indigo-300 mt-3 text-sm">
          {errorMessage}
        </p>

        <button
          onClick={() => setStep("form")}
          className="mt-8 w-full bg-pink-500 hover:bg-pink-600 transition-all duration-300 py-3 rounded-2xl font-semibold"
        >
          Try Again
        </button>

      </div>

    </div>
  );
}

  /* ================= FORM SCREEN ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white px-6 py-10">

      {/* Branding */}
      <div className="text-center mb-8">
        <p className="text-xs tracking-widest text-indigo-300 uppercase">
          BankGo
        </p>
        <h1 className="text-2xl font-semibold mt-2">
          Transfer Money
        </h1>
        <p className="text-indigo-200 text-sm mt-2">
          Fast • Secure • Instant Transfers
        </p>
      </div>

      <form
        onSubmit={handleSend}
        className="max-w-md mx-auto space-y-5"
      >

        {/* From Account */}
       <div className="relative">

  <label className="text-xs text-indigo-300 tracking-wider uppercase">
    From Account
  </label>

  <div className="relative mt-2">

    <select
      name="fromAccount"
      value={form.fromAccount}
      onChange={handleChange}
      className="
        w-full appearance-none
        px-5 py-4
        rounded-2xl
        bg-white/10 backdrop-blur-md
        border border-white/20
        shadow-lg
        text-white
        transition-all duration-300
        hover:bg-white/15
        focus:outline-none
        focus:ring-2 focus:ring-pink-400
        focus:border-transparent
      "
    >
      <option value="" className="text-black">
        Select From Account
      </option>

      {accounts && accounts.length > 0 ? (
  accounts.map((acc) => (
    <option key={acc._id} value={acc._id} className="text-black">
      {acc.type} • {acc.accountNumber}
    </option>
  ))
) : (
  <option disabled className="text-black">
    No accounts found
  </option>
)}

    </select>

    {/* Custom Arrow */}
    <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-indigo-300 text-sm">
      ▼
    </div>

  </div>

</div>

        {/* To Account */}
        <input
          type="text"
          name="toAccount"
          value={form.toAccount}
          onChange={handleChange}
          required
          placeholder="Recipient Account Number"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:ring-2 focus:ring-pink-400 outline-none"
        />

        {/* Amount */}
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          required
          placeholder="Enter Amount"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:ring-2 focus:ring-pink-400 outline-none"
        />

        {/* Note */}
        <input
          type="text"
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Add a note (optional)"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:ring-2 focus:ring-pink-400 outline-none"
        />

        {/* Limit */}
        <p className="text-xs text-indigo-300">
          Daily transfer limit: ₹ 1,00,000
        </p>

        <button
          type="submit"
          className="w-full bg-pink-500 hover:bg-pink-600 transition-all duration-300 py-3 rounded-2xl font-semibold"
        >
          Send Money
        </button>

      </form>

      {/* MPIN MODAL */}
      {step === "mpin" && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center px-6 z-50 animate-fadeIn">

    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 border border-white/10 shadow-2xl rounded-3xl w-full max-w-sm p-8 text-center text-white">

      {/* Lock Icon */}
      <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-pink-400/30">
        <span className="text-2xl">🔒</span>
      </div>

      <h3 className="text-xl font-semibold tracking-wide">
        Confirm Transaction
      </h3>

      <p className="text-indigo-300 text-sm mt-2">
        Enter your 4-digit MPIN to proceed
      </p>

      {/* OTP Style MPIN Boxes */}
      <div className="flex justify-center gap-3 mt-6">
        {[0, 1, 2, 3].map((index) => (
          <input
            key={index}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={form.mpin[index] || ""}
            onChange={(e) => {
  const value = e.target.value.replace(/\D/g, "");

  const newMpin = form.mpin.split("");
  newMpin[index] = value;

  const updated = newMpin.join("").substring(0, 4);
  setForm({ ...form, mpin: updated });

  // Move forward only if digit entered
  if (value && index < 3) {
    const next = document.getElementById(`mpin-${index + 1}`);
    if (next) next.focus();
  }
}}
            id={`mpin-${index}`}
            className="w-12 h-14 text-center text-xl rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-pink-400 outline-none transition-all"
          />
        ))}
      </div>

      {/* Buttons */}
      <div className="mt-8 space-y-3">

        <button
          onClick={handleConfirmTransfer}
          className="w-full bg-pink-500 hover:bg-pink-600 transition-all duration-300 py-3 rounded-2xl font-semibold shadow-lg"
        >
          Confirm Payment
        </button>

        <button
          onClick={() => setStep("form")}
          className="w-full text-indigo-300 text-sm hover:text-white transition"
        >
          Cancel
        </button>

      </div>

      {/* Security Note */}
      <p className="text-[11px] text-indigo-400 mt-6">
        BankGo uses secure encrypted authentication 🔐
      </p>

    </div>
  </div>
)}

    </div>
  );
}