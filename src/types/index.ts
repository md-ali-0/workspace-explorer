export interface WorkspaceItem {
  id: string;
  name: string;
  type: "folder" | "file";
  parentId: string | null;
}

export type WorkspaceFile = WorkspaceItem & {
  type: "file";
  content: string;
};

export type WorkspaceState = {
  items: WorkspaceItem[];
  selectedFolderId: string | null;
  selectedFileId: string | null;
  expandedFolderIds: string[];
  searchQuery: string;
};

export type WorkspaceAction =
  | {
      type: "SELECT_FOLDER";
      payload: string | null;
    }
  | {
      type: "SELECT_FILE";
      payload: string | null;
    }
  | {
      type: "TOGGLE_FOLDER";
      payload: string;
    }
  | {
      type: "SET_SEARCH";
      payload: string;
    }
  | {
      type: "SET_ITEMS";
      payload: WorkspaceItem[];
    };
