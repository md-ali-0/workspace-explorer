import { Navbar } from "@/components/shared/navbar";
import { AppSidebar } from "@/components/shared/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { WorkspaceProvider } from "@/context/workspace-context";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "../styles/globals.css";

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
    title: "Workspace Explorer",
    description: "A file explorer for your workspace",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={cn(
                "h-full",
                "antialiased",
                "font-sans",
                notoSans.variable,
            )}
        >
            <body className="min-h-full flex flex-col">
                <WorkspaceProvider>
                    <div className="flex-1 flex flex-row">
                        <SidebarProvider>
                            <AppSidebar />
                            <div className="flex-1 flex flex-col min-w-0">
                                <Navbar />
                                <main className="flex-1 min-h-0">{children}</main>
                            </div>
                        </SidebarProvider>
                    </div>
                </WorkspaceProvider>
            </body>
        </html>
    );
}
