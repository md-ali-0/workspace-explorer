"use client";

import { Breadcrumb } from "@/components/features/breadcrumb";
import { CreateItemDialog } from "@/components/features/create-item-dialog";
import { DeleteConfirmDialog } from "@/components/features/delete-confirm-dialog";
import { EmptyState } from "@/components/features/empty-state";
import { FileEditor } from "@/components/features/file-editor";
import { ItemCard } from "@/components/features/item-card";
import { RenameDialog } from "@/components/features/rename-confirm-dialog";
import { SearchResultsPanel } from "@/components/features/search-panel-result";
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

    const isSearching = state.searchQuery.trim().length > 0;
    const selectedFileOpen = state.selectedFileId !== null;

    const currentChildren = getChildren(state.selectedFolderId);

    if (selectedFileOpen) {
        return (
            <>
                <FileEditor />
                {renameItem && (
                    <RenameDialog
                        open
                        onClose={() => setRenameItem(null)}
                        item={renameItem}
                    />
                )}
                {deleteItem && (
                    <DeleteConfirmDialog
                        open
                        onClose={() => setDeleteItem(null)}
                        item={deleteItem}
                    />
                )}
            </>
        );
    }

    return (
        <div className="flex h-full flex-col">
            <div className="flex shrink-0 items-center justify-between border-b bg-background/80 px-5 py-3 backdrop-blur-sm">
                <Breadcrumb folderId={state.selectedFolderId} />

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

            <div className="flex-1 overflow-y-auto p-5">
                {isSearching ? (
                    <SearchResultsPanel />
                ) : currentChildren.length === 0 ? (
                    <EmptyState onCreateClick={() => setCreateOpen(true)} />
                ) : (
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
                )}
            </div>

            <CreateItemDialog
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                parentId={state.selectedFolderId}
            />
            {renameItem && (
                <RenameDialog
                    open
                    onClose={() => setRenameItem(null)}
                    item={renameItem}
                />
            )}
            {deleteItem && (
                <DeleteConfirmDialog
                    open
                    onClose={() => setDeleteItem(null)}
                    item={deleteItem}
                />
            )}
        </div>
    );
}
