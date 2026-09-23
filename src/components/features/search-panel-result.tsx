import { useFileSystem } from "@/hooks/use-file-system";
import { useWorkspace } from "@/hooks/use-workspace";
import { WorkspaceItem } from "@/types";
import { FileText, Folder } from "lucide-react";

export function SearchResultsPanel() {
    const { state, dispatch } = useWorkspace();
    const { searchResults } = useFileSystem();

    const handleResultClick = (item: WorkspaceItem) => {
        if (item.type === "folder") {
            dispatch({ type: "SELECT_FOLDER", payload: item.id });
            dispatch({ type: "SET_SEARCH", payload: "" });
        } else {
            dispatch({ type: "SELECT_FOLDER", payload: item.parentId });
            dispatch({ type: "SELECT_FILE", payload: item.id });
            dispatch({ type: "SET_SEARCH", payload: "" });
        }
    };

    const highlight = (text: string, query: string) => {
        if (!query) return text;
        const idx = text.toLowerCase().indexOf(query.toLowerCase());
        if (idx === -1) return text;
        return (
            <>
                {text.slice(0, idx)}
                <mark className="bg-primary/20 text-primary rounded px-0.5">
                    {text.slice(idx, idx + query.length)}
                </mark>
                {text.slice(idx + query.length)}
            </>
        );
    };

    if (searchResults.length === 0) {
        return (
            <div className="flex h-full min-h-75 flex-col items-center justify-center gap-2 text-center">
                <p className="font-medium">No results found</p>
                <p className="text-sm text-muted-foreground">
                    Nothing matches &ldquo;{state.searchQuery}&rdquo;
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            <p className="mb-3 text-xs text-muted-foreground">
                {searchResults.length} result
                {searchResults.length !== 1 ? "s" : ""} for &ldquo;
                {state.searchQuery}&rdquo;
            </p>
            {searchResults.map(({ item, breadcrumb }) => (
                <button
                    key={item.id}
                    onClick={() => handleResultClick(item)}
                    className="flex w-full items-center gap-3 rounded-lg border bg-muted/20 px-4 py-3 text-left transition-colors hover:bg-muted/50"
                    id={`search-result-${item.id}`}
                >
                    {item.type === "folder" ? (
                        <Folder className="size-4 shrink-0 text-primary" />
                    ) : (
                        <FileText className="size-4 shrink-0 text-muted-foreground" />
                    )}
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                            {highlight(item.name, state.searchQuery)}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                            {breadcrumb.slice(0, -1).join(" / ") || "Workspace"}
                        </p>
                    </div>
                </button>
            ))}
        </div>
    );
}
