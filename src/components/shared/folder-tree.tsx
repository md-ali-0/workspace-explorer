"use client";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useFileSystem } from "@/hooks/use-file-system";
import { useWorkspace } from "@/hooks/use-workspace";
import type { WorkspaceItem } from "@/types";
import { ChevronRight, FileText, Folder, FolderOpen } from "lucide-react";

interface TreeNodeProps {
  item: WorkspaceItem;
  depth?: number;
}

export function FolderTree({ item, depth = 0 }: TreeNodeProps) {
  const { state, dispatch } = useWorkspace();
  const { getChildren } = useFileSystem();

  const isFolder = item.type === "folder";
  const isExpanded = state.expandedFolderIds.includes(item.id);
  const isSelectedFolder = state.selectedFolderId === item.id;
  const isSelectedFile = state.selectedFileId === item.id;
  const children = isFolder ? getChildren(item.id) : [];

  const handleFolderClick = () => {
    dispatch({ type: "SELECT_FOLDER", payload: item.id });
    dispatch({ type: "TOGGLE_FOLDER", payload: item.id });
  };

  const handleFileClick = () => {
    dispatch({ type: "SELECT_FILE", payload: item.id });
  };

  if (isFolder) {
    const FolderIcon = isExpanded ? FolderOpen : Folder;

    if (depth === 0) {
      return (
        <Collapsible open={isExpanded}>
          <SidebarMenuItem>
            <CollapsibleTrigger
              render={
                <SidebarMenuButton
                  className="group"
                  isActive={isSelectedFolder}
                  onClick={handleFolderClick}
                  id={`tree-folder-${item.id}`}
                >
                  <ChevronRight
                    className={`size-4 shrink-0 transition-transform duration-200 ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                  />
                  <FolderIcon
                    className={`size-4 shrink-0 ${
                      isSelectedFolder ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </SidebarMenuButton>
              }
            />
            <CollapsibleContent>
              {children.length > 0 && (
                <SidebarMenuSub>
                  {children.map((child) => (
                    <FolderTree key={child.id} item={child} depth={depth + 1} />
                  ))}
                </SidebarMenuSub>
              )}
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      );
    }

    return (
      <Collapsible open={isExpanded}>
        <SidebarMenuSubItem>
          <CollapsibleTrigger
            render={
              <SidebarMenuSubButton
                isActive={isSelectedFolder}
                className="group"
                onClick={handleFolderClick}
                id={`tree-folder-${item.id}`}
              >
                <ChevronRight
                  className={`size-3.5 shrink-0 transition-transform duration-200 ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                />
                <FolderIcon
                  className={`size-4 shrink-0 ${
                    isSelectedFolder ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </SidebarMenuSubButton>
            }
          />
          <CollapsibleContent>
            {children.length > 0 && (
              <SidebarMenuSub>
                {children.map((child) => (
                  <FolderTree key={child.id} item={child} depth={depth + 1} />
                ))}
              </SidebarMenuSub>
            )}
          </CollapsibleContent>
        </SidebarMenuSubItem>
      </Collapsible>
    );
  }

  if (depth === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={isSelectedFile}
          onClick={handleFileClick}
          id={`tree-file-${item.id}`}
        >
          <FileText
            className={`size-4 shrink-0 ${
              isSelectedFile ? "text-primary" : "text-muted-foreground"
            }`}
          />
          <span className="truncate">{item.name}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton
        isActive={isSelectedFile}
        onClick={handleFileClick}
        id={`tree-file-${item.id}`}
      >
        <FileText
          className={`size-4 shrink-0 ${
            isSelectedFile ? "text-primary" : "text-muted-foreground"
          }`}
        />
        <span className="truncate">{item.name}</span>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}
