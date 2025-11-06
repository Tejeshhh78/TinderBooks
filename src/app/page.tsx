import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Heart,
  MessageCircle,
  Library,
  ArrowRight,
} from "lucide-react";
import { redirect } from "next/navigation";

export default async function Home() {
  // Server component, so we simply use the server side auth session info.
  // Based on auth state, we redirect differently.
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If logged in, redirect to discover page
  if (session) {
    redirect("/discover");
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-center mb-8">
            <BookOpen className="size-20 text-primary" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Welcome to <span className="text-primary">BookSwap</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover and exchange physical books by swiping through available
            listings. Match with other book lovers based on what you have and
            what you want.
          </p>

          <div className="flex gap-4 justify-center pt-8">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/signup">
                Get Started
                <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-muted/50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Library className="size-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">Add Your Books</h3>
              <p className="text-muted-foreground">
                List the books you're willing to trade and create a wishlist of
                books you want.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="size-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">Swipe & Match</h3>
              <p className="text-muted-foreground">
                Swipe through available books. Match when both users want each
                other's books.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="size-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">Chat & Exchange</h3>
              <p className="text-muted-foreground">
                Message your matches to coordinate book exchanges and meet up.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 BookSwap. Built with Next.js and better-auth.</p>
        </div>
      </footer>
    </div>
  );
}
