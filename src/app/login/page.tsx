"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { LogIn, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { auth } from "@/lib/firebase/client";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const tokenResult = await credential.user.getIdTokenResult(true);
      const role = tokenResult.claims.role;

      if (!role) {
        await auth.signOut();
        toast.error("Sizda admin panelga kirish huquqi yo'q");
        setLoading(false);
        return;
      }

      toast.success("Muvaffaqiyatli kirdingiz");
      const next = searchParams.get("next") || "/admin";
      router.push(next);
      router.refresh();
    } catch {
      toast.error("Email yoki parol noto'g'ri");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-dim px-4 dark:bg-surface-dark">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-paper p-8 shadow-sm dark:border-line-dark dark:bg-surface-dark-card">
        <Link href="/" className="font-display text-2xl font-bold">
          Zet<span className="text-accent">Play</span>{" "}
          <span className="text-sm font-normal text-muted">News</span>
        </Link>
        <h1 className="mt-6 font-display text-xl font-bold">Admin panelga kirish</h1>
        <p className="mt-1 text-sm text-muted">Faqat vakolatli xodimlar uchun</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-medium text-muted">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-line bg-transparent px-3 py-2.5 text-sm outline-none focus:border-accent dark:border-line-dark"
              placeholder="admin@zetplay.news"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-xs font-medium text-muted">
              Parol
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-line bg-transparent px-3 py-2.5 text-sm outline-none focus:border-accent dark:border-line-dark"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
            Kirish
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
