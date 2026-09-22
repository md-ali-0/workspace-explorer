"use client";

import {
    ChevronRight,
    FileText,
    Folder,
    FolderOpen,
    HardDrive,
    Plus,
} from "lucide-react";

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
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarSeparator,
} from "@/components/ui/sidebar";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" className="border-sidebar-border">
            {/* Header */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="hover:bg-sidebar-accent"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                                <FolderOpen className="size-4" />
                            </div>

                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    Workspace
                                </span>

                                <span className="truncate text-xs text-muted-foreground">
                                    Explorer
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarSeparator />

            {/* Explorer */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Explorer</SidebarGroupLabel>

                    <SidebarGroupAction title="New item">
                        <Plus />
                        <span className="sr-only">New item</span>
                    </SidebarGroupAction>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {/* Projects */}
                            <Collapsible defaultOpen>
                                <SidebarMenuItem>
                                    <CollapsibleTrigger
                                        render={
                                            <SidebarMenuButton className="group">
                                                <ChevronRight className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />

                                                <FolderOpen className="size-4 text-primary" />

                                                <span>Projects</span>
                                            </SidebarMenuButton>
                                        }
                                        
                                    />
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {/* Webbly */}
                                            <Collapsible defaultOpen>
                                                <SidebarMenuSubItem>
                                                    <CollapsibleTrigger
                                                        render={
                                                            <SidebarMenuSubButton
                                                                isActive
                                                                className="group"
                                                            >
                                                                <ChevronRight className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-90" />

                                                                <Folder className="size-4 text-primary" />

                                                                <span>
                                                                    Webbly
                                                                </span>
                                                            </SidebarMenuSubButton>
                                                        }
                                                        
                                                    ></CollapsibleTrigger>

                                                    <CollapsibleContent>
                                                        <SidebarMenuSub>
                                                            <SidebarMenuSubItem>
                                                                <SidebarMenuSubButton>
                                                                    <FileText className="size-4" />
                                                                    <span>
                                                                        notes.txt
                                                                    </span>
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>

                                                            <SidebarMenuSubItem>
                                                                <SidebarMenuSubButton>
                                                                    <FileText className="size-4" />
                                                                    <span>
                                                                        tasks.txt
                                                                    </span>
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        </SidebarMenuSub>
                                                    </CollapsibleContent>
                                                </SidebarMenuSubItem>
                                            </Collapsible>

                                            {/* Personal */}
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton>
                                                    <Folder className="size-4" />
                                                    <span>Personal</span>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>

                            {/* Documents */}
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <Folder className="size-4" />
                                    <span>Documents</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* README */}
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <FileText className="size-4" />
                                    <span>README.txt</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
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
                                <span className="text-xs font-medium">
                                    Local Storage
                                </span>

                                <span className="text-[10px] text-muted-foreground">
                                    48 KB / 5 MB
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
