"use client";

import { WorkspaceContext } from "@/context/workspace-context";
import { useContext } from "react";

export function useWorkspace() {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error(
      "useWorkspace must be used inside WorkspaceProvider",
    );
  }

  return context;
}