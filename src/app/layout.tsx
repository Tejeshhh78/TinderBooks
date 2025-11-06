import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { getServerSession } from "@/lib/auth-server";
import { cookies } from "next/headers";
// Note: Avoid using next/script within <html> directly. We'll inline the
// minimal theme-init script inside <head> to prevent a flash of incorrect
// theme before hydration.

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
  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get("tb-theme")?.value;
  const isDark = cookieTheme === "dark";

  return (
    <html lang="en" suppressHydrationWarning className={isDark ? "dark" : undefined}>
      <head>
        {/* No-flash theme script: ensures correct theme before hydration */}
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `;(function(){
  try {
    var m=document.cookie.match(/(?:^|; )tb-theme=(dark|light)/);
    var t=m&&m[1]?m[1]:(localStorage.getItem('tb-theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));
    if(t==='dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch(e){}
})();`,
          }}
        />
      </head>
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
                <div className="ml-auto">
                  <ThemeToggle />
                </div>
              </header>
              <main className="flex-1">{children}</main>
            </SidebarInset>
          </SidebarProvider>
        ) : (
          // Unauthenticated layout (e.g., login/signup/public pages) – no sidebar
          <main className="min-h-screen">
            <div className="fixed right-4 top-4 z-50">
              <ThemeToggle />
            </div>
            {children}
          </main>
        )}
        <Toaster />
      </body>
    </html>
  );
}
