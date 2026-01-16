"use client";

import { useState } from "react";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      setError("Invalid password");
      return;
    }

    window.location.href = "/admin";
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4">
      <div className="rounded-2xl bg-white/80 p-8 shadow-card">
        <h1 className="font-serif text-3xl text-neutral-900">Admin Login</h1>
        <p className="mt-2 text-sm text-neutral-600">Use the admin password to continue.</p>
        <div className="mt-6 space-y-3">
          <Input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button className="w-full" onClick={submit}>
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}
