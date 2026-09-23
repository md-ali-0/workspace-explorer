/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFileSystem } from "@/hooks/use-file-system";
import { useWorkspace } from "@/hooks/use-workspace";
import type { WorkspaceItem } from "@/types";
import { FileText, Folder, X } from "lucide-react";
import { useEffect, useState } from "react";

interface CreateItemDialogProps {
  open: boolean;
  onClose: () => void;
  parentId: string | null;
  defaultType?: "folder" | "file";
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function CreateItemDialog({
  open,
  onClose,
  parentId,
  defaultType = "file",
}: CreateItemDialogProps) {
  const { dispatch } = useWorkspace();
  const { isDuplicateName } = useFileSystem();

  const [name, setName] = useState("");
  const [type, setType] = useState<"folder" | "file">(defaultType);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName("");
      setError("");
      setType(defaultType);
    }
  }, [open, defaultType]);

  const validate = (value: string): string => {
    if (!value.trim()) return "Name cannot be empty.";
    if (value.includes("/") || value.includes("\\"))
      return 'Name cannot contain "/" or "\\".';
    if (isDuplicateName(value.trim(), parentId))
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

    const newItem: WorkspaceItem = {
      id: generateId(),
      name: trimmed,
      type,
      parentId,
    };

    dispatch({ type: "CREATE_ITEM", payload: newItem });

    // If it's a file, open it immediately
    if (type === "file") {
      dispatch({ type: "SELECT_FILE", payload: newItem.id });
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
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold">New Item</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            id="create-dialog-close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Type toggle */}
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setType("file")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-colors ${
              type === "file"
                ? "border-primary bg-primary/10 text-primary"
                : "border-muted bg-muted/40 text-muted-foreground hover:bg-muted"
            }`}
            id="create-dialog-type-file"
          >
            <FileText className="size-4" />
            Text File
          </button>
          <button
            type="button"
            onClick={() => setType("folder")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-colors ${
              type === "folder"
                ? "border-primary bg-primary/10 text-primary"
                : "border-muted bg-muted/40 text-muted-foreground hover:bg-muted"
            }`}
            id="create-dialog-type-folder"
          >
            <Folder className="size-4" />
            Folder
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              autoFocus
              id="create-dialog-name-input"
              placeholder={type === "file" ? "filename.txt" : "Folder name"}
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
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
              id="create-dialog-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              id="create-dialog-submit"
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
