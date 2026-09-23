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
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DeleteConfirmDialog } from "../features/delete-confirm-dialog";
import { RenameDialog } from "../features/rename-confirm-dialog";

interface FolderTreeProps {
  item: WorkspaceItem;
  depth?: number;
}

interface MenuPosition {
  top: number;
  left: number;
}

function ItemContextMenu({
  item,
  position,
  onClose,
}: {
  item: WorkspaceItem;
  position: MenuPosition;
  onClose: () => void;
}) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPos, setAdjustedPos] = useState(position);

  useEffect(() => {
    if (!menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let { top, left } = position;
    if (left + rect.width > vw) left = vw - rect.width - 8;
    if (top + rect.height > vh) top = top - rect.height - 4;
    setAdjustedPos({ top, left });
  }, [position]);

  const menu = (
    <>
      <div
        className="fixed inset-0 z-998"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

      <div
        ref={menuRef}
        className="fixed z-999 min-w-36 rounded-lg border bg-background p-1 shadow-xl"
        style={{ top: adjustedPos.top, left: adjustedPos.left }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs text-foreground hover:bg-muted"
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

      {renameOpen &&
        createPortal(
          <RenameDialog open onClose={() => setRenameOpen(false)} item={item} />,
          document.body,
        )}
      {deleteOpen &&
        createPortal(
          <DeleteConfirmDialog
            open
            onClose={() => setDeleteOpen(false)}
            item={item}
          />,
          document.body,
        )}
    </>
  );

  return typeof document !== "undefined"
    ? createPortal(menu, document.body)
    : null;
}

export function FolderTree({ item, depth = 0 }: FolderTreeProps) {
  const { state, dispatch } = useWorkspace();
  const { getChildren } = useFileSystem();

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<MenuPosition>({ top: 0, left: 0 });
  const [hovered, setHovered] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

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

  const openMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (menuBtnRef.current) {
      const rect = menuBtnRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, left: rect.left });
    }
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setHovered(false);
  };

  const FolderIcon = isExpanded ? FolderOpen : Folder;

  const menuButton = (
    <button
      ref={menuBtnRef}
      className={`ml-auto flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground transition-opacity hover:bg-sidebar-accent hover:text-foreground ${
        hovered || menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={openMenu}
      id={`sidebar-menu-${item.id}`}
      tabIndex={hovered || menuOpen ? 0 : -1}
    >
      <MoreHorizontal className="size-3" />
    </button>
  );

  if (isFolder && depth === 0) {
    return (
      <>
        <Collapsible open={isExpanded}>
          <SidebarMenuItem>
            <CollapsibleTrigger
              render={
                <SidebarMenuButton
                  className="pr-1"
                  isActive={isSelectedFolder}
                  onClick={handleFolderClick}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => !menuOpen && setHovered(false)}
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
                  <span className="truncate flex-1">{item.name}</span>
                  {menuButton}
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
        {menuOpen && (
          <ItemContextMenu item={item} position={menuPos} onClose={closeMenu} />
        )}
      </>
    );
  }

  if (isFolder && depth > 0) {
    return (
      <>
        <Collapsible open={isExpanded}>
          <SidebarMenuSubItem>
            <CollapsibleTrigger
              render={
                <SidebarMenuSubButton
                  isActive={isSelectedFolder}
                  className="pr-1"
                  onClick={handleFolderClick}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => !menuOpen && setHovered(false)}
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
                  <span className="truncate flex-1">{item.name}</span>
                  {menuButton}
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
        {menuOpen && (
          <ItemContextMenu item={item} position={menuPos} onClose={closeMenu} />
        )}
      </>
    );
  }

  if (!isFolder && depth === 0) {
    return (
      <>
        <SidebarMenuItem>
          <SidebarMenuButton
            isActive={isSelectedFile}
            onClick={handleFileClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => !menuOpen && setHovered(false)}
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
        </SidebarMenuItem>
        {menuOpen && (
          <ItemContextMenu item={item} position={menuPos} onClose={closeMenu} />
        )}
      </>
    );
  }

  return (
    <>
      <SidebarMenuSubItem>
        <SidebarMenuSubButton
          isActive={isSelectedFile}
          onClick={handleFileClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => !menuOpen && setHovered(false)}
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
      </SidebarMenuSubItem>
      {menuOpen && (
        <ItemContextMenu item={item} position={menuPos} onClose={closeMenu} />
      )}
    </>
  );
}
