import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function History() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/api/transactions/all`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white flex flex-col">

      {/* 🔹 Top Branding */}
      <div className="px-6 pt-8 pb-6 border-b border-white/10">

        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs tracking-widest text-indigo-300 uppercase">
              BankGo
            </p>
            <h2 className="text-xl font-semibold mt-1">
              Transaction History
            </h2>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition"
          >
            Back
          </button>
        </div>

      </div>

      {/* 🔹 Transaction List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-6 space-y-4">

        {loading ? (
          <p className="text-indigo-300 text-sm">
            Loading transactions...
          </p>
        ) : transactions.length === 0 ? (
          <div className="text-center mt-20 text-indigo-300">
            <p className="text-lg">No Transactions Yet</p>
            <p className="text-xs mt-2">
              Your transfers will appear here.
            </p>
          </div>
        ) : (
     transactions.map((txn) => {

  const isDebit = txn.type === "DEBIT";

  const dateObj = new Date(txn.transaction.createdAt);

  const formattedDate = dateObj.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  const formattedTime = dateObj.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div
      key={txn._id}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 shadow-lg border border-white/10"
    >

      {/* Row 1 */}
      <div className="flex justify-between items-center">

        <div className={`text-sm font-semibold ${
          isDebit ? "text-red-400" : "text-green-400"
        }`}>
          {isDebit ? "DEBIT" : "CREDIT"}
        </div>

        <div className="text-lg font-bold">
          ₹ {Number(txn.amount).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </div>

      </div>

      {/* Row 2 */}
      <div className="text-xs text-indigo-300 mt-3 space-y-1">

        <div>
          From: {txn.transaction?.fromAccount?.accountNumber || "—"}
        </div>

        <div>
          To: {txn.transaction?.toAccount?.accountNumber || "—"}
        </div>

        <div>
          Note: {txn.transaction?.description || "not available"}
        </div>

      </div>

      {/* Row 3 — Date & Time */}
      <div className="flex justify-between mt-4 text-[11px] text-indigo-400">

        <span>{formattedDate}</span>
        <span>{formattedTime}</span>

      </div>

    </div>
  );
})
        )}

      </div>

    </div>
  );
}