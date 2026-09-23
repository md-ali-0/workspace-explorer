"use client";

import { useWorkspace } from "@/hooks/use-workspace";
import type { SearchResult, WorkspaceItem } from "@/types";
import { useMemo } from "react";

export function useFileSystem() {
  const { state } = useWorkspace();
  const { items, fileContents, searchQuery } = state;

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

  const getAllDescendantIds = useMemo(() => {
    return (itemId: string): string[] => {
      const ids = [itemId];
      const queue = [itemId];

      while (queue.length) {
        const currentId = queue.shift()!;

        items
          .filter((item) => item.parentId === currentId)
          .forEach((child) => {
            ids.push(child.id);
            queue.push(child.id);
          });
      }

      return ids;
    };
  }, [items]);

  const searchResults = useMemo((): SearchResult[] => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return [];

    return items
      .filter((item) => item.name.toLowerCase().includes(query))
      .map((item) => {
        const path: string[] = [];
        let current = item.parentId
          ? items.find((parent) => parent.id === item.parentId)
          : undefined;

        while (current) {
          path.unshift(current.name);

          current = current.parentId
            ? items.find((parent) => parent.id === current?.parentId)
            : undefined;
        }

        return {
          item,
          breadcrumb: [...path, item.name],
        };
      });
  }, [items, searchQuery]);

  const isDuplicateName = useMemo(() => {
    return (
      name: string,
      parentId: string | null,
      excludeId?: string,
    ): boolean => {
      const normalizedName = name.toLowerCase();

      return items.some(
        (item) =>
          item.parentId === parentId &&
          item.name.toLowerCase() === normalizedName &&
          item.id !== excludeId,
      );
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
    getAllDescendantIds,
    searchResults,
    isDuplicateName,
    getItem,
    getContent,
  };
}