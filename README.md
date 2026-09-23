# Workspace Explorer

A clean, browser-based file manager and workspace explorer built with Next.js and Tailwind CSS. It lets you organize files in folders, edit text files, and persist everything in your browser's local storage.

## Features

- **Folder Tree & Grid View**: Browse items through a collapsible sidebar tree or the main grid view.
- **File Operations**: Create, rename, and delete files and folders with validation checks.
- **Built-in File Editor**: Open and edit text files directly with real-time saving.
- **Search**: Instant search across all files and folders in the workspace.
- **Breadcrumb Navigation**: Easily track and navigate folder hierarchy.
- **Local Persistence**: Workspace state and file contents are stored locally in the browser (`localStorage`).

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **UI Primitives**: Base UI / Shadcn

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build

```bash
pnpm build
pnpm start
```
