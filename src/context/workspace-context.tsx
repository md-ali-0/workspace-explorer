"use client";

import {
  createContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";

import type { WorkspaceAction, WorkspaceState } from "@/types";

const initialState: WorkspaceState = {
    items: [],
    fileContents: {},
    selectedFolderId: null,
    selectedFileId: null,
    expandedFolderIds: [],
    searchQuery: "",
};

function workspaceReducer(
    state: WorkspaceState,
    action: WorkspaceAction,
): WorkspaceState {
    switch (action.type) {
        case "INIT":
            return {
                ...state,
                items: action.payload.items,
                fileContents: action.payload.fileContents,
            };

        case "SELECT_FOLDER":
            return {
                ...state,
                selectedFolderId: action.payload,
                selectedFileId: null,
            };

        case "SELECT_FILE":
            return {
                ...state,
                selectedFileId: action.payload,
            };

        case "TOGGLE_FOLDER": {
            const exists = state.expandedFolderIds.includes(action.payload);

            return {
                ...state,
                expandedFolderIds: exists
                    ? state.expandedFolderIds.filter(
                          (id) => id !== action.payload,
                      )
                    : [...state.expandedFolderIds, action.payload],
            };
        }

        case "SET_SEARCH":
            return {
                ...state,
                searchQuery: action.payload,
            };

        case "CREATE_ITEM": {
            const newContents =
                action.payload.type === "file"
                    ? { ...state.fileContents, [action.payload.id]: "" }
                    : state.fileContents;

            return {
                ...state,
                items: [...state.items, action.payload],
                fileContents: newContents,
            };
        }
        case "RENAME_ITEM": {
            return {
                ...state,
                items: state.items.map((item) =>
                    item.id === action.payload.id
                        ? { ...item, name: action.payload.name }
                        : item,
                ),
            };
        }

        case "UPDATE_CONTENT": {
            return {
                ...state,
                fileContents: {
                    ...state.fileContents,
                    [action.payload.id]: action.payload.content,
                },
                items: state.items.map((item) =>
                    item.id === action.payload.id
                        ? { ...item }
                        : item,
                ),
            };
        }
        default:
            return state;
    }
}

type WorkspaceContextValue = {
    state: WorkspaceState;
    dispatch: Dispatch<WorkspaceAction>;
};

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(
    null,
);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(workspaceReducer, initialState);

    return (
        <WorkspaceContext.Provider value={{ state, dispatch }}>
            {children}
        </WorkspaceContext.Provider>
    );
}
