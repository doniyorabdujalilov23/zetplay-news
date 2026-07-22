import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="font-display text-8xl font-bold text-line dark:text-line-dark">404</span>
      <div className="mt-2 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
        <SearchX size={26} />
      </div>
      <h1 className="mt-6 font-display text-2xl font-bold sm:text-3xl">Sahifa topilmadi</h1>
      <p className="mt-2 max-w-md text-muted">
        Siz izlagan sahifa o'chirilgan, ko'chirilgan yoki hech qachon mavjud bo'lmagan bo'lishi
        mumkin.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
        >
          Bosh sahifaga qaytish
        </Link>
        <Link
          href="/qidiruv"
          className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold transition hover:border-accent hover:text-accent dark:border-line-dark"
        >
          Qidirish
        </Link>
      </div>
    </div>
  );
}
