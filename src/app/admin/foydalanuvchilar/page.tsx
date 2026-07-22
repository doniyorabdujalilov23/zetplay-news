"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import {
  getUsersList,
  createUserAccount,
  updateUserRole,
  deleteUserAccount,
} from "@/lib/data/admin-users";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/utils/format";
import { ROLE_LABELS } from "@/lib/constants";
import type { AppUser, UserRole } from "@/types";

const emptyForm = { email: "", password: "", displayName: "", role: "editor" as UserRole };

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setLoading(true);
    getUsersList()
      .then(setUsers)
      .catch(() => toast.error("Foydalanuvchilarni yuklab bo'lmadi"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createUserAccount(form);
      toast.success("Foydalanuvchi yaratildi");
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = async (uid: string, role: UserRole) => {
    try {
      await updateUserRole(uid, role);
      setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, role } : u)));
      toast.success("Rol yangilandi");
    } catch {
      toast.error("Rolni yangilashda xatolik");
    }
  };

  const handleDelete = async (user: AppUser) => {
    if (!window.confirm(`"${user.displayName}" foydalanuvchisini o'chirasizmi?`)) return;
    try {
      await deleteUserAccount(user.uid);
      setUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      toast.success("Foydalanuvchi o'chirildi");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "O'chirishda xatolik");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Foydalanuvchilar</h1>
          <p className="mt-1 text-sm text-muted">Admin, muharrir va moderatorlarni boshqarish</p>
        </div>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
        >
          <Plus size={16} /> Yangi foydalanuvchi
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mt-6 grid gap-3 rounded-xl border border-line p-4 sm:grid-cols-2 dark:border-line-dark">
          <input
            type="text"
            required
            value={form.displayName}
            onChange={(e) => setForm((prev) => ({ ...prev, displayName: e.target.value }))}
            placeholder="To'liq ism"
            className="rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-line-dark"
          />
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="Email"
            className="rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-line-dark"
          />
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            placeholder="Parol (kamida 6 belgi)"
            className="rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-line-dark"
          />
          <select
            value={form.role}
            onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value as UserRole }))}
            className="rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-line-dark"
          >
            <option value="admin">Administrator</option>
            <option value="editor">Muharrir</option>
            <option value="moderator">Moderator</option>
          </select>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 rounded-lg bg-ink py-2.5 text-sm font-semibold text-white transition hover:bg-ink/80 disabled:opacity-60 dark:bg-paper dark:text-ink sm:col-span-2"
          >
            {submitting ? <Loader2 size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
            Foydalanuvchi yaratish
          </button>
        </form>
      )}

      <div className="mt-6 overflow-hidden rounded-xl border border-line dark:border-line-dark">
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="animate-spin text-accent" size={22} />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-paper-dim text-left text-xs uppercase tracking-wide text-muted dark:bg-surface-dark-card">
              <tr>
                <th className="px-4 py-3">Ism</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Ro'yxatdan o'tgan</th>
                <th className="px-4 py-3 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line dark:divide-line-dark">
              {users.map((user) => (
                <tr key={user.uid}>
                  <td className="px-4 py-3 font-medium">{user.displayName}</td>
                  <td className="px-4 py-3 text-muted">{user.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      disabled={user.uid === currentUser?.uid}
                      onChange={(e) => handleRoleChange(user.uid, e.target.value as UserRole)}
                      className="rounded-lg border border-line bg-transparent px-2 py-1 text-xs outline-none focus:border-accent disabled:opacity-50 dark:border-line-dark"
                    >
                      <option value="admin">{ROLE_LABELS.admin}</option>
                      <option value="editor">{ROLE_LABELS.editor}</option>
                      <option value="moderator">{ROLE_LABELS.moderator}</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-muted">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleDelete(user)}
                        disabled={user.uid === currentUser?.uid}
                        aria-label="O'chirish"
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-ink transition hover:border-red-500 hover:text-red-500 disabled:opacity-40 dark:border-line-dark dark:text-paper"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && users.length === 0 && (
          <p className="p-8 text-center text-sm text-muted">Foydalanuvchilar topilmadi.</p>
        )}
      </div>
    </div>
  );
}
