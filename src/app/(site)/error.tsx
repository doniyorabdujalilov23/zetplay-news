"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Sahifada xatolik:", error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
        <AlertTriangle size={28} />
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold">Nimadir xato ketdi</h1>
      <p className="mt-2 max-w-md text-muted">
        Sahifani yuklashda kutilmagan xatolik yuz berdi. Iltimos, qayta urinib ko'ring yoki bosh
        sahifaga qayting.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
        >
          <RotateCw size={15} /> Qayta urinish
        </button>
        <Link
          href="/"
          className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold transition hover:border-accent hover:text-accent dark:border-line-dark"
        >
          Bosh sahifa
        </Link>
      </div>
    </div>
  );
}
