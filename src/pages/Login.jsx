import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Lock } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function Login({ onLoginSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Vérification de votre mot de passe secret local
    if (password === "*****7") {
      if (onLoginSuccess) {
        onLoginSuccess(); // Active la session admin locale
      }
      navigate("/admin/servers"); // Redirige directement vers le gestionnaire de serveurs
    } else {
      setError("Invalid admin password");
    }
  };

  return (
    <AuthLayout
      icon={LogIn}
      title="Admin Access"
      subtitle="Enter your security credentials to manage servers"
    >
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Admin Password</Label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium">
          Unlock Dashboard
        </Button>
      </form>
    </AuthLayout>
  );
}
