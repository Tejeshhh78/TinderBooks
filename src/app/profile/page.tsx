import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { userProfile } from "@/db/schema";
import Image from "next/image";
import { safeImageSrc } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { ProfileForm } from "./_components/profile-form";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const profile = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, session.user.id))
    .limit(1);

  const existingProfile = profile[0] || null;

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      <div className="bg-card rounded-lg border p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          {session.user.image ? (
            <div className="relative w-20 h-20 rounded-full overflow-hidden">
              <Image
                src={safeImageSrc(session.user.image, "avatar")}
                alt={session.user.name || "profile"}
                fill
                sizes="80px"
                className="object-cover brightness-100 dark:brightness-100"
              />
            </div>
          ) : (
            <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {session.user.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold">{session.user.name}</h2>
            <p className="text-muted-foreground">{session.user.email}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Note: When you match with someone, they can see your name, city, bio, and favorite genres.
        </p>
      </div>

      <ProfileForm existingProfile={existingProfile} hasImage={Boolean(session.user.image)} />
    </div>
  );
}
