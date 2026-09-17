import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLoginSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validating against your secret string
    if (password === "*****7") {
      if (onLoginSuccess) {
        onLoginSuccess(); // Fires the localStorage and auth state update in App.jsx
      }
      navigate("/"); // Smoothly transitions the user to the portfolio page
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-void px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-sm border border-border bg-bedrock p-8 shadow-2xl">
        <h2 className="font-heading text-2xl font-bold text-iron mb-6 text-center">Protected Access</h2>
        
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs uppercase tracking-widest text-tungsten">Enter Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            className="rounded-sm border border-border bg-void p-3 font-mono text-sm text-iron focus:border-redstone/50 outline-none"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="mt-3 font-mono text-xs uppercase text-redstone text-center">Incorrect password</p>
        )}

        <button type="submit" className="mt-6 w-full rounded-sm border border-redstone bg-redstone/10 py-3 font-mono text-xs uppercase tracking-widest text-redstone hover:bg-redstone/20 transition-colors">
          Unlock
        </button>
      </form>
    </div>
  );
}
