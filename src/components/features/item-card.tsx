import { useWorkspace } from "@/hooks/use-workspace";
import { WorkspaceItem } from "@/types";
import { Edit, FileText, Folder, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";

interface ItemCardProps {
  item: WorkspaceItem;
  onRename: (item: WorkspaceItem) => void;
  onDelete: (item: WorkspaceItem) => void;
}

export function ItemCard({ item, onRename, onDelete }: ItemCardProps) {
  const { dispatch } = useWorkspace();
  const [menuOpen, setMenuOpen] = useState(false);

  const isFolder = item.type === "folder";

  const handleClick = () => {
    if (isFolder) {
      dispatch({ type: "SELECT_FOLDER", payload: item.id });
    } else {
      dispatch({ type: "SELECT_FILE", payload: item.id });
    }
  };

  return (
    <div
      className="group relative flex flex-col items-start gap-3 rounded-xl border bg-muted/30 p-4 transition-all hover:bg-muted/60 hover:shadow-sm cursor-pointer"
      onClick={handleClick}
      id={`item-card-${item.id}`}
    >
      <div
        className={`flex size-10 items-center justify-center rounded-lg ${
          isFolder
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {isFolder ? (
          <Folder className="size-5" />
        ) : (
          <FileText className="size-5" />
        )}
      </div>

      <div className="min-w-0 w-full">
        <p className="truncate text-sm font-medium">{item.name}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {isFolder ? "Folder" : "Text file"}
        </p>
      </div>

      <button
        className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen((o) => !o);
        }}
        id={`item-menu-${item.id}`}
      >
        <MoreHorizontal className="size-4" />
      </button>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(false);
            }}
          />
          <div
            className="absolute right-2 top-8 z-20 min-w-35 rounded-lg border bg-background p-1 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm hover:bg-muted"
              onClick={() => {
                setMenuOpen(false);
                onRename(item);
              }}
              id={`item-rename-${item.id}`}
            >
              <Edit className="size-3.5 text-muted-foreground" />
              Rename
            </button>
            <button
              className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10"
              onClick={() => {
                setMenuOpen(false);
                onDelete(item);
              }}
              id={`item-delete-${item.id}`}
            >
              <Trash2 className="size-3.5" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
