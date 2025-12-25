"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, Home } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Hardcoded credentials: root/root
    if (email === "root" && password === "root") {
      // Set auth cookie
      document.cookie = "auth=true; path=/";
      window.location.href = "/";
    } else {
      setError("Identifiants incorrects");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl animate-pulse" />
      <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl animate-pulse [animation-delay:1s]" />

      <Card className="relative z-10 w-full max-w-md border-white/10 bg-white/95 shadow-2xl backdrop-blur-sm">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto">
            <div className="relative inline-block">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 blur-lg opacity-50" />
              <div className="relative rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 p-4">
                <Home className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">Se connecter</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Identifiant"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                Mot de passe oublié ?
              </a>
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
            >
              SE CONNECTER
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
