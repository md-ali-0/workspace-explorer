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
import {
  ChevronRight,
  Edit,
  FileText,
  Folder,
  FolderOpen,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { DeleteConfirmDialog } from "../features/delete-confirm-dialog";
import { RenameDialog } from "../features/rename-confirm-dialog";

interface FolderTreeProps {
  item: WorkspaceItem;
  depth?: number;
}

function ContextMenu({
  item,
  onClose,
}: {
  item: WorkspaceItem;
  onClose: () => void;
}) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <div
        className="absolute left-full top-0 z-30 ml-1 min-w-35 rounded-lg border bg-background p-1 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs hover:bg-muted"
          onClick={() => {
            onClose();
            setRenameOpen(true);
          }}
          id={`sidebar-rename-${item.id}`}
        >
          <Edit className="size-3 text-muted-foreground" />
          Rename
        </button>
        <button
          className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10"
          onClick={() => {
            onClose();
            setDeleteOpen(true);
          }}
          id={`sidebar-delete-${item.id}`}
        >
          <Trash2 className="size-3" />
          Delete
        </button>
      </div>
      {renameOpen && (
        <RenameDialog
          open
          onClose={() => setRenameOpen(false)}
          item={item}
        />
      )}
      {deleteOpen && (
        <DeleteConfirmDialog
          open
          onClose={() => setDeleteOpen(false)}
          item={item}
        />
      )}
    </>
  );
}

export function FolderTree({ item, depth = 0 }: FolderTreeProps) {
  const { state, dispatch } = useWorkspace();
  const { getChildren } = useFileSystem();
  const [menuOpen, setMenuOpen] = useState(false);

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

  const FolderIcon = isExpanded ? FolderOpen : Folder;

  // Shared context menu button
  const menuButton = (
    <button
      className="ml-auto flex size-5 shrink-0 items-center justify-center rounded opacity-0 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground group-hover/item:opacity-100"
      onClick={(e) => {
        e.stopPropagation();
        setMenuOpen((o) => !o);
      }}
      id={`sidebar-menu-${item.id}`}
    >
      <MoreHorizontal className="size-3" />
    </button>
  );

  if (isFolder) {
    if (depth === 0) {
      return (
        <>
          {menuOpen && (
            <div
              className="fixed inset-0 z-20"
              onClick={() => setMenuOpen(false)}
            />
          )}
          <Collapsible open={isExpanded}>
            <SidebarMenuItem className="relative group/item">
              <CollapsibleTrigger
                render={
                  <SidebarMenuButton
                    className="group pr-1"
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
                        isSelectedFolder
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span className="truncate flex-1">{item.name}</span>
                    {menuButton}
                  </SidebarMenuButton>
                }
              />
              {menuOpen && (
                <ContextMenu item={item} onClose={() => setMenuOpen(false)} />
              )}
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
        </>
      );
    }

    return (
      <>
        {menuOpen && (
          <div
            className="fixed inset-0 z-20"
            onClick={() => setMenuOpen(false)}
          />
        )}
        <Collapsible open={isExpanded}>
          <SidebarMenuSubItem className="relative group/item">
            <CollapsibleTrigger
              render={
                <SidebarMenuSubButton
                  isActive={isSelectedFolder}
                  className="group pr-1"
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
                      isSelectedFolder
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span className="truncate flex-1">{item.name}</span>
                  {menuButton}
                </SidebarMenuSubButton>
              }
            />
            {menuOpen && (
              <ContextMenu item={item} onClose={() => setMenuOpen(false)} />
            )}
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
      </>
    );
  }

  // File node
  if (depth === 0) {
    return (
      <>
        {menuOpen && (
          <div
            className="fixed inset-0 z-20"
            onClick={() => setMenuOpen(false)}
          />
        )}
        <SidebarMenuItem className="relative group/item">
          <SidebarMenuButton
            isActive={isSelectedFile}
            onClick={handleFileClick}
            className="pr-1"
            id={`tree-file-${item.id}`}
          >
            <FileText
              className={`size-4 shrink-0 ${
                isSelectedFile ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <span className="truncate flex-1">{item.name}</span>
            {menuButton}
          </SidebarMenuButton>
          {menuOpen && (
            <ContextMenu item={item} onClose={() => setMenuOpen(false)} />
          )}
        </SidebarMenuItem>
      </>
    );
  }

  return (
    <>
      {menuOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <SidebarMenuSubItem className="relative group/item">
        <SidebarMenuSubButton
          isActive={isSelectedFile}
          onClick={handleFileClick}
          className="pr-1"
          id={`tree-file-${item.id}`}
        >
          <FileText
            className={`size-4 shrink-0 ${
              isSelectedFile ? "text-primary" : "text-muted-foreground"
            }`}
          />
          <span className="truncate flex-1">{item.name}</span>
          {menuButton}
        </SidebarMenuSubButton>
        {menuOpen && (
          <ContextMenu item={item} onClose={() => setMenuOpen(false)} />
        )}
      </SidebarMenuSubItem>
    </>
  );
}
