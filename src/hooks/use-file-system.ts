"use client";

import { useWorkspace } from "@/hooks/use-workspace";
import type { WorkspaceItem } from "@/types";
import { useMemo } from "react";

export function useFileSystem() {
    const { state } = useWorkspace();
    const { items, fileContents } = state;

    const getChildren = useMemo(() => {
        return (parentId: string | null): WorkspaceItem[] => {
            return items
                .filter((item) => item.parentId === parentId)
                .sort((a, b) => {
                    if (a.type !== b.type) {
                        return a.type === "folder" ? -1 : 1;
                    }

                    return a.name.localeCompare(b.name);
                });
        };
    }, [items]);

    const getBreadcrumb = useMemo(() => {
        return (folderId: string | null): WorkspaceItem[] => {
            if (!folderId) return [];

            const breadcrumb: WorkspaceItem[] = [];
            let current = items.find((item) => item.id === folderId);

            while (current) {
                breadcrumb.unshift(current);

                current = current.parentId
                    ? items.find((item) => item.id === current?.parentId)
                    : undefined;
            }

            return breadcrumb;
        };
    }, [items]);

    const getItem = useMemo(() => {
        return (id: string): WorkspaceItem | undefined => {
            return items.find((item) => item.id === id);
        };
    }, [items]);

    const getContent = useMemo(() => {
        return (fileId: string): string => {
            return fileContents[fileId] ?? "";
        };
    }, [fileContents]);

    return {
        getChildren,
        getBreadcrumb,
        getItem,
        getContent,
    };
}
