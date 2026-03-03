import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Splash() {
  const [notes, setNotes] = useState([]);
  const circleRef = useRef(null);
  const navigate = useNavigate();

  // Random spawn logic
  useEffect(() => {
    const interval = setInterval(() => {
      const newNote = {
        id: Date.now(),
        left: Math.random() * 80 + "%",
        icon: ["💸", "💵", "💰"][Math.floor(Math.random() * 3)],
        delay: Math.random() * 0.5,
      };

      setNotes((prev) => [...prev, newNote]);

      setTimeout(() => {
        setNotes((prev) => prev.filter((note) => note.id !== newNote.id));
      }, 4000);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // Ripple effect
  const handleRipple = (e) => {
    const button = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${e.clientY - button.offsetTop - radius}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();

    button.appendChild(circle);
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    setTimeout(()=>{
      if(token && user){
        navigate("/dashboard");
      }else{
        navigate("/start");
      }

    }, 300)
  };

  return (
    <div className="h-[100dvh] bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white flex flex-col">
      <div className="flex-1 flex flex-col justify-between px-6 py-10">

        {/* Logo */}
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="bg-white/10 backdrop-blur-lg px-8 py-6 rounded-3xl shadow-2xl">
            <h1 className="text-3xl font-bold tracking-wide">
              Bank<span className="text-pink-400">Go</span>
            </h1>
          </div>

          <p className="mt-5 text-indigo-200 text-sm leading-relaxed max-w-xs">
            Secure • Fast • Smart Digital Banking
          </p>
        </div>

        {/* Animated Circle */}
        <div className="flex justify-center my-12">
          <div
            ref={circleRef}
            className="relative w-56 h-56 bg-white/5 rounded-full flex items-center justify-center shadow-inner backdrop-blur-sm overflow-hidden shimmer"
          >
            <span className="text-indigo-200 text-sm text-center px-4 z-10">
              Smart Digital Banking
            </span>

            {notes.map((note) => (
              <span
                key={note.id}
                className="money-note"
                style={{
                  left: note.left,
                  bottom: "10px",
                  animationDelay: `${note.delay}s`,
                }}
              >
                {note.icon}
              </span>
            ))}
          </div>
        </div>

        {/* Button */}
        <div className="mb-6">
          <button
            onClick={handleRipple}
            className="relative overflow-hidden w-full bg-pink-500 active:scale-95 transition-transform duration-200 py-3.5 rounded-2xl font-semibold shadow-lg text-sm"
          >
            Get Started
          </button>
        </div>

      </div>
    </div>
  );
}