import { useFileSystem } from "@/hooks/use-file-system";
import { useWorkspace } from "@/hooks/use-workspace";
import { ChevronRight } from "lucide-react";

export function Breadcrumb({ folderId }: { folderId: string | null }) {
  const { dispatch } = useWorkspace();
  const { getBreadcrumb } = useFileSystem();

  const chain = getBreadcrumb(folderId);

  return (
    <nav className="flex items-center gap-1 text-sm" aria-label="Breadcrumb">
      <button
        onClick={() => dispatch({ type: "SELECT_FOLDER", payload: null })}
        className="shrink-0 font-medium text-muted-foreground hover:text-foreground transition-colors"
        id="breadcrumb-root"
      >
        Workspace
      </button>

      {chain.map((ancestor) => (
        <span key={ancestor.id} className="flex items-center gap-1">
          <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/60" />
          <button
            onClick={() =>
              dispatch({ type: "SELECT_FOLDER", payload: ancestor.id })
            }
            className={`truncate max-w-30 transition-colors ${
              ancestor.id === folderId
                ? "font-semibold text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            id={`breadcrumb-${ancestor.id}`}
          >
            {ancestor.name}
          </button>
        </span>
      ))}
    </nav>
  );
}
