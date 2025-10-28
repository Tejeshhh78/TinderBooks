"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signIn, signUp } from "@/lib/auth"
import { seedTestData } from "@/lib/seed-data"
import { Database } from "lucide-react"

interface AuthFormProps {
  onSuccess: () => void
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    console.log("[v0] handleSubmit - starting", { isSignUp, email })

    try {
      const result = isSignUp ? await signUp(email, password, name) : await signIn(email, password)

      console.log("[v0] handleSubmit - result:", result)

      if (result.error) {
        setError(result.error)
      } else {
        console.log("[v0] handleSubmit - calling onSuccess")
        onSuccess()
      }
    } catch (err) {
      console.error("[v0] handleSubmit - error:", err)
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSeedData = () => {
    try {
      seedTestData()
      setError("")
      alert(
        "Test data loaded! You can now log in with:\n\nalice@test.com\nbob@test.com\ncarol@test.com\ndavid@test.com\nemma@test.com\n\nPassword: anything\n\nThe page will reload to apply changes.",
      )
      window.location.reload()
    } catch (err) {
      console.error("[v0] handleSeedData - error:", err)
      setError("Failed to load test data")
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{isSignUp ? "Create Account" : "Welcome Back"}</CardTitle>
        <CardDescription>
          {isSignUp ? "Sign up to start swapping books" : "Sign in to continue swapping"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError("")
            }}
          >
            {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">For Testing</span>
            </div>
          </div>

          <Button type="button" variant="outline" className="w-full bg-transparent" onClick={handleSeedData}>
            <Database className="mr-2 h-4 w-4" />
            Load Test Data
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
