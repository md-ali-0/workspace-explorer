"use client";

import { FolderOpen, HardDrive, Plus } from "lucide-react";
import { useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import { FolderTree } from "@/components/shared/folder-tree";
import { useFileSystem } from "@/hooks/use-file-system";
import { useWorkspace } from "@/hooks/use-workspace";
import { CreateItemDialog } from "../features/create-item-dialog";

export function AppSidebar() {
  const { state, dispatch } = useWorkspace();
  const { getChildren } = useFileSystem();
  const [createOpen, setCreateOpen] = useState(false);

  const rootItems = getChildren(null);

  // Calculate approximate localStorage usage
  const storageUsed = (() => {
    try {
      let total = 0;
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith("wse_v1")) {
          total += (localStorage.getItem(key) ?? "").length * 2; // UTF-16
        }
      }
      return `${Math.round(total / 1024)} KB / 5 MB`;
    } catch {
      return "— / 5 MB";
    }
  })();

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-sidebar-accent"
              onClick={() =>
                dispatch({ type: "SELECT_FOLDER", payload: null })
              }
              id="sidebar-workspace-root"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <FolderOpen className="size-4" />
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Workspace</span>
                <span className="truncate text-xs text-muted-foreground">
                  Explorer
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Explorer Tree */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Explorer</SidebarGroupLabel>

          <SidebarGroupAction
            title="New item in current folder"
            onClick={() => setCreateOpen(true)}
            id="sidebar-new-item"
          >
            <Plus className="size-4" />
            <span className="sr-only">New item</span>
          </SidebarGroupAction>

          <SidebarGroupContent>
            <SidebarMenu>
              {rootItems.length === 0 ? (
                <SidebarMenuItem>
                  <span className="px-2 py-4 text-xs text-muted-foreground">
                    No items yet. Create one!
                  </span>
                </SidebarMenuItem>
              ) : (
                rootItems.map((item) => (
                  <FolderTree key={item.id} item={item} depth={0} />
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Local Storage">
              <HardDrive className="size-4" />

              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-xs font-medium">Local Storage</span>
                <span className="text-[10px] text-muted-foreground">
                  {storageUsed}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <CreateItemDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        parentId={state.selectedFolderId}
      />
    </Sidebar>
  );
}
