import { Navbar } from "@/components/shared/navbar";
import { AppSidebar } from "@/components/shared/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
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
                <SidebarProvider>
                    <div className="flex-1 flex flex-row">
                        <AppSidebar />
                        <div className="flex-1 flex flex-col">
                            <Navbar />
                            <main className="flex-1">{children}</main>
                        </div>
                    </div>
                </SidebarProvider>
            </body>
        </html>
    );
}
