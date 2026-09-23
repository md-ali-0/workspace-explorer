"use client";

import { Button } from "@/components/ui/button";
import { useFileSystem } from "@/hooks/use-file-system";
import { useWorkspace } from "@/hooks/use-workspace";
import type { WorkspaceItem } from "@/types";
import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  item: WorkspaceItem;
}

export function DeleteConfirmDialog({
  open,
  onClose,
  item,
}: DeleteConfirmDialogProps) {
  const { dispatch } = useWorkspace();
  const { getAllDescendantIds } = useFileSystem();

  const isFolder = item.type === "folder";
  const childrenCount = isFolder ? getAllDescendantIds(item.id).length - 1 : 0;

  const handleDelete = () => {
    dispatch({ type: "DELETE_ITEM", payload: item.id });
    onClose();
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
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-4" />
            <h2 className="text-base font-semibold">Delete {isFolder ? "Folder" : "File"}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            id="delete-dialog-close"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mb-6 space-y-2 text-sm text-muted-foreground">
          <p>
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">&quot;{item.name}&quot;</span>?
          </p>
          {isFolder && childrenCount > 0 && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive text-xs">
              This folder contains {childrenCount} item
              {childrenCount !== 1 ? "s" : ""} that will also be permanently
              deleted.
            </p>
          )}
          <p className="text-xs">This action cannot be undone.</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            id="delete-dialog-cancel"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={handleDelete}
            id="delete-dialog-confirm"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
