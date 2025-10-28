"use client"

export interface Message {
  id: string
  matchId: string
  senderId: string
  content: string
  createdAt: string
}

const MESSAGES_KEY = "bookswap_messages"

function getAllMessages(): Message[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(MESSAGES_KEY)
  if (!stored) return []

  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

function saveMessages(messages: Message[]) {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
}

export function getMatchMessages(matchId: string): Message[] {
  const messages = getAllMessages()
  return messages
    .filter((m) => m.matchId === matchId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
}

export function sendMessage(matchId: string, senderId: string, content: string): Message {
  const messages = getAllMessages()

  const newMessage: Message = {
    id: crypto.randomUUID(),
    matchId,
    senderId,
    content,
    createdAt: new Date().toISOString(),
  }

  messages.push(newMessage)
  saveMessages(messages)

  return newMessage
}
