import Link from "next/link";

export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 text-center dark:bg-surface-dark">
      <span className="font-display text-7xl font-bold text-line dark:text-line-dark">404</span>
      <h1 className="mt-4 font-display text-2xl font-bold">Sahifa topilmadi</h1>
      <Link
        href="/"
        className="mt-6 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
      >
        Bosh sahifaga qaytish
      </Link>
    </div>
  );
}
