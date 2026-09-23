import { FolderOpen, Plus } from "lucide-react";
import { Button } from "../ui/button";

export function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="flex h-full min-h-75 flex-col items-center justify-center gap-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        <FolderOpen className="size-8 text-muted-foreground" />
      </div>
      <div>
        <p className="font-medium">This folder is empty</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a new file or folder to get started.
        </p>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={onCreateClick}
        className="gap-2"
        id="empty-state-create-button"
      >
        <Plus className="size-4" />
        Create something
      </Button>
    </div>
  );
}