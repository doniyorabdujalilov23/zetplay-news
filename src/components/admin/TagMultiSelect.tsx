"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import type { Tag } from "@/types";

interface TagMultiSelectProps {
  allTags: Tag[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  onCreateTag: (name: string) => Promise<Tag>;
}

export function TagMultiSelect({ allTags, selectedIds, onChange, onCreateTag }: TagMultiSelectProps) {
  const [inputValue, setInputValue] = useState("");
  const [creating, setCreating] = useState(false);

  const toggleTag = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((tagId) => tagId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const handleCreate = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    const existing = allTags.find((t) => t.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) {
      if (!selectedIds.includes(existing.id)) onChange([...selectedIds, existing.id]);
      setInputValue("");
      return;
    }
    setCreating(true);
    try {
      const newTag = await onCreateTag(trimmed);
      onChange([...selectedIds, newTag.id]);
      setInputValue("");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted">Teglar</label>
      <div className="flex flex-wrap gap-1.5 rounded-lg border border-line p-2 dark:border-line-dark">
        {selectedIds.map((id) => {
          const tag = allTags.find((t) => t.id === id);
          if (!tag) return null;
          return (
            <span
              key={id}
              className="flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-xs text-accent"
            >
              #{tag.name}
              <button type="button" onClick={() => toggleTag(id)} aria-label="Tegni olib tashlash">
                <X size={11} />
              </button>
            </span>
          );
        })}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void handleCreate();
            }
          }}
          placeholder="Teg qo'shish..."
          className="min-w-[100px] flex-1 bg-transparent px-1 text-sm outline-none"
        />
        <button
          type="button"
          onClick={handleCreate}
          disabled={creating || !inputValue.trim()}
          aria-label="Teg yaratish"
          className="flex h-6 w-6 items-center justify-center rounded-full text-muted hover:text-accent disabled:opacity-40"
        >
          <Plus size={14} />
        </button>
      </div>

      {allTags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {allTags
            .filter((t) => !selectedIds.includes(t.id))
            .slice(0, 12)
            .map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className="rounded-full border border-line px-2.5 py-1 text-xs text-muted transition hover:border-accent hover:text-accent dark:border-line-dark"
              >
                #{tag.name}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
