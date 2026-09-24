 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../api/authApi";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (loading) return;
    setLoading(true); setError("");
    try {
      const data = await login(username, password);
      localStorage.setItem("token", data.accessToken || data.token);
      localStorage.setItem("user", JSON.stringify(data));
      router.replace("/products");
    } catch {
      setError("Invalid username or password.");
    } finally { setLoading(false); }
  }

  return <main className="flex min-h-screen items-center justify-center p-4">
    <form onSubmit={submit} className="w-full max-w-md rounded-xl bg-white p-8 shadow">
      <h1 className="mb-6 text-2xl font-bold">Product Admin Login</h1>
      {error && <p className="mb-4 rounded bg-red-50 p-3 text-red-700">{error}</p>}
      <label className="mb-1 block">Username</label><input value={username} onChange={e=>setUsername(e.target.value)} className="mb-4 w-full rounded border px-3 py-2"/>
      <label className="mb-1 block">Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mb-6 w-full rounded border px-3 py-2"/>
      <button disabled={loading} className="w-full rounded bg-slate-900 py-2 text-white">{loading ? "Logging in..." : "Login"}</button>
      <p className="mt-4 text-xs text-slate-500">Demo: emilys / emilyspass</p>
    </form>
  </main>;
}
