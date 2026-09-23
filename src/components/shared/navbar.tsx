/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useWorkspace } from "@/hooks/use-workspace";
import { Command, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function Navbar() {
  const { state, dispatch } = useWorkspace();
  const [localQuery, setLocalQuery] = useState(state.searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: "SET_SEARCH", payload: localQuery });
    }, 200);
    return () => clearTimeout(timer);
  }, [localQuery, dispatch]);

  useEffect(() => {
    if (state.searchQuery === "" && localQuery !== "") {
      setLocalQuery("");
    }
  }, [state.searchQuery]);


  return (
    <header className="h-14 shrink-0 border-b bg-background">
      <div className="flex h-full items-center justify-between px-4 md:px-6">

        {/* Brand + sidebar trigger */}
        <div className="flex shrink-0 items-center gap-3">
          <SidebarTrigger className="size-8" id="sidebar-toggle" />

          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-tight">Workspace</span>

            <Separator
              orientation="vertical"
              className="hidden h-5 sm:block"
            />

            <span className="hidden text-sm text-muted-foreground sm:block">
              Explorer
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="mx-4 hidden flex-1 justify-center md:flex">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              ref={inputRef}
              id="navbar-search-input"
              placeholder="Search files or folders..."
              className="h-9 bg-muted/40 pl-9 pr-20"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
            />

            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
              <Badge
                variant="secondary"
                className="h-5 gap-0.5 px-1.5 text-[10px] font-normal text-muted-foreground"
              >
                <Command className="size-3" />
                K
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border bg-muted/40 px-3 py-1.5 sm:flex">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-muted-foreground">Saved</span>
          </div>
        </div>
      </div>
    </header>
  );
}