"use client";

import { useState } from "react";
import { Facebook, Send, Twitter, Link2, Check } from "lucide-react";
import toast from "react-hot-toast";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      key: "facebook",
      label: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      key: "telegram",
      label: "Telegram",
      icon: Send,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      key: "twitter",
      label: "X (Twitter)",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Havola nusxalandi");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Havolani nusxalab bo'lmadi");
    }
  };

  return (
    <div className="flex items-center gap-2">
      {shareLinks.map(({ key, label, icon: Icon, href }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label} orqali ulashish`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition hover:border-accent hover:text-accent dark:border-line-dark dark:text-paper"
        >
          <Icon size={15} />
        </a>
      ))}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Havolani nusxalash"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition hover:border-accent hover:text-accent dark:border-line-dark dark:text-paper"
      >
        {copied ? <Check size={15} /> : <Link2 size={15} />}
      </button>
    </div>
  );
}
