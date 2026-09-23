import type { WorkspaceItem } from "@/types";

const workspaceItemsKey = "workspace_Items";
const workspaceContentsKey = "workspace_Contents";

export const workspaceItems: WorkspaceItem[] = [
    {
        id: "1",
        name: "Projects",
        type: "folder",
        parentId: null,
    },
    {
        id: "2",
        name: "Webbly",
        type: "folder",
        parentId: "1",
    },
    {
        id: "3",
        name: "notes.txt",
        type: "file",
        parentId: "2",
    },
    {
        id: "4",
        name: "tasks.txt",
        type: "file",
        parentId: "2",
    },
    {
        id: "5",
        name: "Personal",
        type: "folder",
        parentId: "1",
    },
    {
        id: "6",
        name: "Documents",
        type: "folder",
        parentId: null,
    },
    {
        id: "7",
        name: "README.txt",
        type: "file",
        parentId: null,
    },
];

export const workspaceContents: Record<string, string> = {
    "3":
        "# Webbly Project Notes\n\nKey contacts, ideas, and meeting summaries go here.",
    "4":
        "# Webbly Tasks\n\n- [ ] Complete frontend assessment\n- [ ] Deploy to Vercel\n- [ ] Write README",
    "7":
        "# Workspace\n\nWelcome to your workspace. Use the sidebar to navigate folders and files.",
};

export function loadWorkspaceItems(): WorkspaceItem[] {
    const itemsJson = localStorage.getItem(workspaceItemsKey);
    if (itemsJson) {
        try {
            const items = JSON.parse(itemsJson) as WorkspaceItem[];
            return items;
        } catch (error) {
            console.error(
                "Failed to parse workspace items from localStorage:",
                error,
            );
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
            console.error(
                "Failed to parse workspace contents from localStorage:",
                error,
            );
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
