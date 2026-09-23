/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Button } from "@/components/ui/button";
import { useFileSystem } from "@/hooks/use-file-system";
import { useWorkspace } from "@/hooks/use-workspace";
import { FileText, Save, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export function FileEditor() {
    const { state, dispatch } = useWorkspace();
    const { getItem, getContent } = useFileSystem();

    const fileId = state.selectedFileId;
    const file = fileId ? getItem(fileId) : null;
    const savedContent = fileId ? getContent(fileId) : "";

    const [localContent, setLocalContent] = useState(savedContent);
    const [isDirty, setIsDirty] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setLocalContent(savedContent);
        setIsDirty(false);
    }, [fileId]);

    const handleChange = (value: string) => {
        setLocalContent(value);
        setIsDirty(value !== savedContent);
    };

    const handleSave = useCallback(() => {
        if (!fileId) return;
        dispatch({
            type: "UPDATE_CONTENT",
            payload: { id: fileId, content: localContent },
        });
        setIsDirty(false);
    }, [fileId, localContent, dispatch]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                if (isDirty) handleSave();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isDirty, handleSave]);

    const handleClose = () => {
        dispatch({ type: "SELECT_FILE", payload: null });
    };

    if (!file) return null;

    return (
        <div className="flex h-full flex-col bg-background">
            <div className="flex shrink-0 items-center justify-between border-b bg-muted/30 px-4 py-2.5">
                <div className="flex items-center gap-2 min-w-0">
                    <FileText className="size-4 shrink-0 text-muted-foreground" />
                    <span className="truncate text-sm font-medium">
                        {file.name}
                    </span>
                    {isDirty && (
                        <span
                            className="ml-1 size-2 shrink-0 rounded-full bg-amber-500"
                            title="Unsaved changes"
                        />
                    )}
                </div>

                <div className="flex items-center gap-1 ml-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSave}
                        disabled={!isDirty}
                        className="h-7 gap-1.5 text-xs"
                        id="editor-save-button"
                    >
                        <Save className="size-3.5" />
                        Save
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={handleClose}
                        id="editor-close-button"
                    >
                        <X className="size-3.5" />
                        <span className="sr-only">Close editor</span>
                    </Button>
                </div>
            </div>

            <div className="shrink-0 border-b bg-muted/10 px-4 py-1">
                <span className="text-[10px] text-muted-foreground">
                    {isDirty
                        ? "Unsaved changes — press Ctrl+S to save"
                        : "All changes saved"}
                </span>
            </div>

            <textarea
                ref={textareaRef}
                id={`editor-textarea-${fileId}`}
                value={localContent}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleSave}
                spellCheck={false}
                className="flex-1 resize-none bg-background p-4 font-mono text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
                placeholder={`Start writing in ${file.name}...`}
            />
        </div>
    );
}
