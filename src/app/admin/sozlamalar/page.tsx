"use client";

import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { getSiteSettings } from "@/lib/data/settings";
import { saveSiteSettings } from "@/lib/data/admin-settings";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { SiteSettings } from "@/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSiteSettings()
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await saveSiteSettings(settings);
      toast.success("Sozlamalar saqlandi");
    } catch {
      toast.error("Saqlashda xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={28} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold">Sozlamalar</h1>
      <p className="mt-1 text-sm text-muted">Sayt sozlamalarini boshqarish</p>

      <div className="mt-6 space-y-6">
        <div className="rounded-xl border border-line p-5 dark:border-line-dark">
          <h2 className="font-display text-lg font-bold">Umumiy</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Sayt nomi</label>
              <input
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-line-dark"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Sayt tavsifi</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                rows={2}
                className="w-full resize-none rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-line-dark"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Footer matni</label>
              <input
                value={settings.footerText}
                onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-line-dark"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-line p-5 dark:border-line-dark">
          <h2 className="font-display text-lg font-bold">Logotip va Favicon</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <ImageUploader
              value={settings.logoUrl}
              onChange={({ url }) => setSettings({ ...settings, logoUrl: url })}
              folder="uploads"
              label="Logotip"
            />
            <ImageUploader
              value={settings.faviconUrl}
              onChange={({ url }) => setSettings({ ...settings, faviconUrl: url })}
              folder="uploads"
              label="Favicon"
            />
          </div>
        </div>

        <div className="rounded-xl border border-line p-5 dark:border-line-dark">
          <h2 className="font-display text-lg font-bold">Ijtimoiy tarmoqlar</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(["facebook", "instagram", "telegram", "youtube", "twitter"] as const).map((key) => (
              <input
                key={key}
                value={settings.socials[key] || ""}
                onChange={(e) =>
                  setSettings({ ...settings, socials: { ...settings.socials, [key]: e.target.value } })
                }
                placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)} havolasi`}
                className="rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-line-dark"
              />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-line p-5 dark:border-line-dark">
          <h2 className="font-display text-lg font-bold">Google Analytics</h2>
          <input
            value={settings.googleAnalyticsId || ""}
            onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
            placeholder="G-XXXXXXXXXX"
            className="mt-4 w-full rounded-lg border border-line bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-accent dark:border-line-dark"
          />
        </div>

        <div className="rounded-xl border border-line p-5 dark:border-line-dark">
          <h2 className="font-display text-lg font-bold">Reklama kodlari</h2>
          <div className="mt-4 space-y-3">
            {(
              [
                { key: "headerCode", label: "Header reklama kodi" },
                { key: "sidebarCode", label: "Sidebar reklama kodi" },
                { key: "inArticleCode", label: "Maqola ichidagi reklama kodi" },
                { key: "footerCode", label: "Footer reklama kodi" },
              ] as const
            ).map(({ key, label }) => (
              <div key={key}>
                <label className="mb-1.5 block text-xs font-medium text-muted">{label}</label>
                <textarea
                  value={settings.adSlots[key] || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, adSlots: { ...settings.adSlots, [key]: e.target.value } })
                  }
                  rows={2}
                  placeholder="<script>...</script>"
                  className="w-full resize-none rounded-lg border border-line bg-transparent px-3 py-2 font-mono text-xs outline-none focus:border-accent dark:border-line-dark"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-60"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Saqlash
        </button>
      </div>
    </div>
  );
}
