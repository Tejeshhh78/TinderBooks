"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuthState, signOut, updateUser, type User } from "@/lib/auth"
import { ProfileSetup } from "@/components/profile-setup"
import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LogOut, Edit } from "lucide-react"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const authState = getAuthState()
    if (!authState.isAuthenticated) {
      router.push("/")
    } else {
      setUser(authState.user)
      if (!authState.user?.favoriteGenres || authState.user.favoriteGenres.length === 0) {
        setIsEditing(true)
      }
      setIsLoading(false)
    }
  }, [router])

  const handleUpdate = (updates: Partial<User>) => {
    const updatedUser = updateUser(updates)
    if (updatedUser) {
      setUser(updatedUser)
      setIsEditing(false)
    }
  }

  const handleSignOut = () => {
    signOut()
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!user) return null

  if (isEditing) {
    return (
      <main className="min-h-screen pb-20 p-4 flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        <ProfileSetup user={user} onUpdate={handleUpdate} onComplete={() => setIsEditing(false)} />
      </main>
    )
  }

  return (
    <main className="min-h-screen pb-20 p-4 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <div className="max-w-2xl mx-auto space-y-4 pt-4">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              {user.location && <p className="text-sm text-muted-foreground mt-1">{user.location}</p>}
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.bio && (
              <div>
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-sm text-muted-foreground">{user.bio}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2">Favorite Genres</h3>
              <div className="flex flex-wrap gap-2">
                {user.favoriteGenres.map((genre) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button variant="outline" className="w-full bg-transparent" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <NavBar />
    </main>
  )
}
