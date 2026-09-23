import type { WorkspaceItem } from "@/types";

const workspaceItemsKey = "workspace_Items";
const workspaceContentsKey = "workspace_Contents";

export const workspaceItems: WorkspaceItem[] = [
    {
        id: "1",
        name: "Folder 1",
        type: "folder",
        parentId: null,
    },
    {
        id: "2",
        name: "File 1",
        type: "file",
        parentId: "1",
    },
];

export const workspaceContents: Record<string, string> = {
    "2": "This is the content of File 1.",
};

export function loadWorkspaceItems(): WorkspaceItem[] {
    const itemsJson = localStorage.getItem(workspaceItemsKey);
    if (itemsJson) {
        try {
            const items = JSON.parse(itemsJson) as WorkspaceItem[];
            return items;
        } catch (error) {
            console.error("Failed to parse workspace items from localStorage:", error);
        }
    }
    return workspaceItems;
}

export function saveWorkspaceItems(items: WorkspaceItem[]): void {
    localStorage.setItem(workspaceItemsKey, JSON.stringify(items));
}

export function loadWorkspaceContents(): Record<string, string> {
    const contentsJson = localStorage.getItem(workspaceContentsKey);
    if (contentsJson) {
        try {
            const contents = JSON.parse(contentsJson) as Record<string, string>;
            return contents;
        } catch (error) {
            console.error("Failed to parse workspace contents from localStorage:", error);
        }
    }
    return workspaceContents;
}

export function saveWorkspaceContents(contents: Record<string, string>): void {
    localStorage.setItem(workspaceContentsKey, JSON.stringify(contents));
}


export function clearStorage(): void {
  localStorage.removeItem(workspaceItemsKey);
  localStorage.removeItem(workspaceContentsKey);
}
