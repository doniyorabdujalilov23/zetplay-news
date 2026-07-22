"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    router.push(`/qidiruv?q=${encodeURIComponent(trimmed)}`);
    setOpen(false);
    setValue("");
  };

  return (
    <div className="relative flex items-center">
      <AnimatePresence>
        {open && (
          <motion.form
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="overflow-hidden"
          >
            <input
              ref={inputRef}
              type="search"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Yangiliklarni qidirish..."
              className="w-full border-b border-ink bg-transparent px-2 py-1 text-sm outline-none dark:border-paper"
            />
          </motion.form>
        )}
      </AnimatePresence>
      <button
        type="button"
        aria-label={open ? "Qidiruvni yopish" : "Qidiruvni ochish"}
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition hover:border-accent hover:text-accent dark:border-line-dark dark:text-paper"
      >
        {open ? <X size={17} /> : <Search size={17} />}
      </button>
    </div>
  );
}
