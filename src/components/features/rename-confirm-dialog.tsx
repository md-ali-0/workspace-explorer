/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFileSystem } from "@/hooks/use-file-system";
import { useWorkspace } from "@/hooks/use-workspace";
import type { WorkspaceItem } from "@/types";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface RenameDialogProps {
  open: boolean;
  onClose: () => void;
  item: WorkspaceItem;
}

export function RenameDialog({ open, onClose, item }: RenameDialogProps) {
  const { dispatch } = useWorkspace();
  const { isDuplicateName } = useFileSystem();

  const [name, setName] = useState(item.name);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName(item.name);
      setError("");
    }
  }, [open, item.name]);

  const validate = (value: string): string => {
    if (!value.trim()) return "Name cannot be empty.";
    if (value.includes("/") || value.includes("\\"))
      return 'Name cannot contain "/" or "\\".';
    if (
      value.trim().toLowerCase() !== item.name.toLowerCase() &&
      isDuplicateName(value.trim(), item.parentId, item.id)
    )
      return `An item named "${value.trim()}" already exists here.`;
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    const validationError = validate(trimmed);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (trimmed !== item.name) {
      dispatch({ type: "RENAME_ITEM", payload: { id: item.id, name: trimmed } });
    }
    onClose();
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (error) setError(validate(value));
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-xl border bg-background p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold">
            Rename {item.type === "folder" ? "Folder" : "File"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            id="rename-dialog-close"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              autoFocus
              id="rename-dialog-input"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              onFocus={(e) => e.target.select()}
              className={error ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {error && (
              <p className="mt-1.5 text-xs text-destructive">{error}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              id="rename-dialog-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              id="rename-dialog-submit"
            >
              Rename
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
