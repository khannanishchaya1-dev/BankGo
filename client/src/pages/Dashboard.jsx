import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../features/authSlice";
import { useState } from "react";
import { useRef, useEffect } from "react";

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const offerRef = useRef(null);
  const [activeIndex, setActiveIndex] = React.useState(0);


  useEffect(() => {
  const container = offerRef.current;
  if (!container) return;

  let index = 0;
  const cards = container.children;

  const interval = setInterval(() => {
    index = (index + 1) % cards.length;

    container.scrollTo({
  left: cards[index].offsetLeft,
  behavior: "smooth",
});

    setActiveIndex(index);
  }, 1500);

  return () => clearInterval(interval);
}, []);

  const handleLogout = async () => {
  await dispatch(logoutUser());
  navigate("/login");
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white px-5 py-6">

      {/* Header */}
     {/* Top Header */}
<div className="flex justify-between items-center mb-8">

  <div>
    <p className="text-xs tracking-widest text-indigo-300 uppercase">
      BankGo
    </p>

    <h2 className="text-xl font-semibold mt-1">
      Hello, {user?.name || "User"} 👋
    </h2>

    <p className="text-indigo-200 text-sm">
      Welcome back
    </p>
  </div>

  <button
    onClick={handleLogout}
    className="text-sm bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition"
  >
    Logout
  </button>
</div>
{/* Security + Last Login Info */}
<div className="flex justify-between items-center bg-white/5 rounded-xl px-4 py-3 mb-6 text-xs text-indigo-200">
  <span>Last Login: Today, 10:42 AM</span>
  <span className="text-green-400 font-medium">Secure Session 🔐</span>
</div>

      {/* Balance Card */}
<div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl mb-8">

  {/* Header Row */}
  <div className="flex justify-between items-center">
    <p className="text-indigo-200 text-sm">Available Balance</p>

    <button
      onClick={() => setShowBalance(!showBalance)}
      className="text-sm bg-white/10 px-3 py-1 rounded-lg hover:bg-white/20 transition"
    >
      {showBalance ? "🙈 Hide" : "👁 Show"}
    </button>
  </div>


  {/* Balance */}
  <h1 className="text-3xl font-bold mt-4 tracking-wide">
    {showBalance ? "₹ 1,25,000.00" : "₹ ••••••"}
  </h1>

  {/* Account Details */}
  <div className="flex justify-between mt-6 text-sm text-indigo-200">
    <span>
      Account No: {showBalance ? "**** 4589" : "**** ****"}
    </span>
    <span>Savings</span>
    
  </div>
</div>

     
      {/* New Offers Section */}
{/* New Offers Section */}
<div className="mt-10">
  <h3 className="text-lg font-semibold mb-4">New Offers</h3>

  <div ref={offerRef} className="flex overflow-x-auto gap-5 snap-x snap-mandatory scrollbar-hide pb-4">

    {/* Offer Card */}
    <div className="min-w-[98%] h-68 snap-center rounded-3xl overflow-hidden relative shadow-xl">

      <img
        src="/offer1.avif"
        alt="Offer 1"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

      <div className="absolute bottom-6 left-6 right-6">
        <h4 className="text-xl font-bold">Fly More, Spend Less ✈️</h4>
        <p className="text-sm text-gray-200 mt-2">
          Get up to 15% cashback on domestic & international flight bookings.
        </p>
      </div>
    </div>

    {/* Offer 2 */}
    <div className="min-w-[98%] h-68 snap-center rounded-3xl overflow-hidden relative shadow-xl">

      <img
        src="/offer2.avif"
        alt="Offer 2"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

      <div className="absolute bottom-6 left-6 right-6">
        <h4 className="text-xl font-bold">Secure Your Future Today 🏦</h4>
        <p className="text-sm text-gray-200 mt-2">
          Open FD instantly at 7.5% interest — safe, stable, rewarding.
        </p>
      </div>
    </div>

    {/* Offer 3 */}
    <div className="min-w-[98%] h-68 snap-center rounded-3xl overflow-hidden relative shadow-xl">

      <img
        src="/offer3.jpg"
        alt="Offer 3"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

      <div className="absolute bottom-6 left-6 right-6">
        <h4 className="text-xl font-bold">Transfer Without Charges 💸</h4>
        <p className="text-sm text-gray-200 mt-2">
          Enjoy zero-fee IMPS & NEFT transfers all month long.
        </p>
      </div>
    </div>
{}
{/* Offer 4 */}
     <div className="min-w-[98%] h-68 snap-center rounded-3xl overflow-hidden relative shadow-xl">

      <img
        src="/offer4.jpg"
        alt="Offer 4"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

      <div className="absolute bottom-6 left-6 right-6">
        <h4 className="text-xl font-bold">Festive Bonanza is Here 🎉</h4>
        <p className="text-sm text-gray-200 mt-2">
          Heavy cashback across shopping, travel & dining this season.
        </p>
      </div>
    </div>



    {/* Offer 5 */}
    <div className="min-w-[98%] h-68 snap-center rounded-3xl overflow-hidden relative shadow-xl">

      <img
        src="/offer5.jpg"
        alt="Offer 5"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

      <div className="absolute bottom-6 left-6 right-6">
        <h4 className="text-xl font-bold">Unlock Premium Card Benefits </h4>
        <p className="text-sm text-gray-200 mt-2">
          Extra rewards, lounge access & exclusive lifestyle offers.
        </p>
      </div>
    </div>

  </div>
</div>
{/* Pagination Dots */}
<div className="flex justify-center mt-4 gap-2">
  {Array.from({ length: 5 }).map((_, i) => (
    <div
      key={i}
      className={`h-2 rounded-full transition-all duration-300 ${
        activeIndex === i
          ? "w-6 bg-white"
          : "w-2 bg-white/40"
      }`}
    />
  ))}
</div>

{/* Quick Actions */}
     {/* Quick Actions */}
<div>
  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

  <div className="grid grid-cols-3 gap-4">

    {/* Transfer */}
    <div className="bg-white/10 rounded-2xl p-4 flex flex-col items-center justify-center shadow-lg hover:bg-white/20 transition cursor-pointer">
      <span className="text-2xl">💸</span>
      <p className="text-xs mt-2 text-center">Transfer</p>
    </div>

    {/* History */}
    <div className="bg-white/10 rounded-2xl p-4 flex flex-col items-center justify-center shadow-lg hover:bg-white/20 transition cursor-pointer">
      <span className="text-2xl">📄</span>
      <p className="text-xs mt-2 text-center">History</p>
    </div>

    {/* Open Account */}
    <div onClick={() => navigate('/open-account')} className="bg-white/10 rounded-2xl p-4 flex flex-col items-center justify-center shadow-lg hover:bg-white/20 transition cursor-pointer">
      <span className="text-2xl">🏦</span>
      <p className="text-xs mt-2 text-center">Open Account</p>
    </div>

  </div>
</div>
      

{/* Support Section */}
<div className="mt-10 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl p-4 text-sm flex justify-between items-center">
  <div>
    <p className="font-semibold">Need Assistance?</p>
    <p className="text-indigo-200 text-xs">
      Our support team is available 24/7
    </p>
  </div>
  <button className="bg-white/20 px-4 py-2 rounded-xl text-xs hover:bg-white/30 transition">
    Contact Support
  </button>
</div>
{/* Footer */}
<footer className="mt-12 pt-6 border-t border-white/10 text-center text-xs text-indigo-300 space-y-2">

  <p>© {new Date().getFullYear()} BankGo. All rights reserved.</p>

  <div className="flex justify-center gap-6">
    <span className="hover:text-white cursor-pointer transition">
      Privacy Policy
    </span>
    <span className="hover:text-white cursor-pointer transition">
      Terms of Service
    </span>
    <span className="hover:text-white cursor-pointer transition">
      Help & Support
    </span>
  </div>

  <p className="text-indigo-400 text-[10px]">
    Secure Digital Banking Platform
  </p>

</footer>

    </div>
  );
}