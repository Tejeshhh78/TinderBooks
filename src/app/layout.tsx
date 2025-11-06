import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { getServerSession } from "@/lib/auth-server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookSwap - Exchange Books with Book Lovers",
  description:
    "Discover and exchange physical books by swiping through available listings",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Determine if a user session exists on the server. If not, hide the sidebar/header.
  const session = await getServerSession();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {session ? (
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="flex items-center gap-2 text-sm font-semibold">
                  📚 BookSwap
                </div>
              </header>
              <main className="flex-1">{children}</main>
            </SidebarInset>
          </SidebarProvider>
        ) : (
          // Unauthenticated layout (e.g., login/signup/public pages) – no sidebar
          <main className="min-h-screen">{children}</main>
        )}
        <Toaster />
      </body>
    </html>
  );
}
