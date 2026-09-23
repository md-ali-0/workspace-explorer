"use client";

import { ItemCard } from "@/components/features/item-card";
import { CreateItemDialog } from "@/components/shared/create-item-dialog";
import { Button } from "@/components/ui/button";
import { useFileSystem } from "@/hooks/use-file-system";
import { useWorkspace } from "@/hooks/use-workspace";
import { WorkspaceItem } from "@/types";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Home() {
    const { state } = useWorkspace();
    const { getChildren } = useFileSystem();

    const [createOpen, setCreateOpen] = useState(false);
    const [renameItem, setRenameItem] = useState<WorkspaceItem | null>(null);
    const [deleteItem, setDeleteItem] = useState<WorkspaceItem | null>(null);

    const currentChildren = getChildren(state.selectedFolderId);

    return (
        <div className="flex h-full flex-col">
            <div className="flex shrink-0 items-center justify-between border-b bg-background/80 px-5 py-3 backdrop-blur-sm">
                <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5 text-xs"
                    onClick={() => setCreateOpen(true)}
                    id="main-panel-create-button"
                >
                    <Plus className="size-3.5" />
                    New
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {currentChildren.map((item) => (
                        <ItemCard
                            key={item.id}
                            item={item}
                            onRename={setRenameItem}
                            onDelete={setDeleteItem}
                        />
                    ))}
                </div>
            </div>

            {/* Dialogs */}
            <CreateItemDialog
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                parentId={state.selectedFolderId}
            />
        </div>
    );
}
