import type { WorkspaceItem } from "@/types";

const workspaceItemsKey = "workspaceItems";
const workspaceContentsKey = "workspaceContents";

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

export function saveWorkspaceItems(items: WorkspaceItem[]): void {
    localStorage.setItem(workspaceItemsKey, JSON.stringify(items));
}

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

export function saveWorkspaceContents(contents: Record<string, string>): void {
    localStorage.setItem(workspaceContentsKey, JSON.stringify(contents));
}
