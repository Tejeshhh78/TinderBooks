"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Book } from "@/lib/books"

interface BookSelectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  books: Book[]
  onSelect: (bookId: string) => void
  targetBook: Book
}

export function BookSelectionDialog({ open, onOpenChange, books, onSelect, targetBook }: BookSelectionDialogProps) {
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null)

  const handleConfirm = () => {
    if (selectedBookId) {
      onSelect(selectedBookId)
      setSelectedBookId(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select a Book to Offer</DialogTitle>
          <DialogDescription>Choose one of your books to trade for "{targetBook.title}"</DialogDescription>
        </DialogHeader>

        {books.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>You don't have any books to offer yet.</p>
            <p className="text-sm mt-1">Add books to your collection first.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-3">
              {books.map((book) => (
                <Card
                  key={book.id}
                  className={`cursor-pointer transition-colors ${
                    selectedBookId === book.id ? "border-primary bg-accent" : "hover:bg-accent/50"
                  }`}
                  onClick={() => setSelectedBookId(book.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{book.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">by {book.author}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {book.genre}
                      </Badge>
                      {book.condition && (
                        <Badge variant="outline" className="text-xs capitalize">
                          {book.condition.replace("-", " ")}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button onClick={handleConfirm} disabled={!selectedBookId} className="w-full">
              Confirm Trade Offer
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
