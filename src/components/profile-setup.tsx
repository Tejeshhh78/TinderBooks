"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/lib/auth"

interface ProfileSetupProps {
  user: User
  onUpdate: (updates: Partial<User>) => void
  onComplete?: () => void
}

const GENRES = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Thriller",
  "Romance",
  "Science Fiction",
  "Fantasy",
  "Biography",
  "History",
  "Self-Help",
  "Poetry",
  "Horror",
  "Young Adult",
  "Classics",
]

export function ProfileSetup({ user, onUpdate, onComplete }: ProfileSetupProps) {
  const [name, setName] = useState(user.name)
  const [bio, setBio] = useState(user.bio || "")
  const [location, setLocation] = useState(user.location || "")
  const [selectedGenres, setSelectedGenres] = useState<string[]>(user.favoriteGenres || [])

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre].slice(0, 5)))
  }

  const handleSave = () => {
    onUpdate({
      name,
      bio,
      location,
      favoriteGenres: selectedGenres,
    })
    onComplete?.()
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Complete Your Profile</CardTitle>
        <CardDescription>Tell us about yourself and your reading preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, State"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about your reading interests..."
            rows={4}
          />
        </div>

        <div className="space-y-3">
          <div>
            <Label>Favorite Genres (select up to 5)</Label>
            <p className="text-sm text-muted-foreground mt-1">{selectedGenres.length}/5 selected</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => {
              const isSelected = selectedGenres.includes(genre)
              return (
                <Badge
                  key={genre}
                  variant={isSelected ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleGenre(genre)}
                >
                  {genre}
                </Badge>
              )
            })}
          </div>
        </div>

        <Button onClick={handleSave} className="w-full" disabled={selectedGenres.length === 0}>
          Save Profile
        </Button>
      </CardContent>
    </Card>
  )
}
