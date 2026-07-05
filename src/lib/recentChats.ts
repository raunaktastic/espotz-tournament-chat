import type { ChatChannel } from "../types/chat"

export const RECENT_CHATS_KEY = "chat-recent-ids"
export const RECENT_CHATS_MAX = 6
export const MESSAGE_WINDOW_SIZE = 30

export function touchRecent(chatId: string, prev: string[], max = RECENT_CHATS_MAX): string[] {
  return [chatId, ...prev.filter((id) => id !== chatId)].slice(0, max)
}

export function seedRecentFromChannels(channels: ChatChannel[]): string[] {
  const ids: string[] = []
  for (const channel of channels) {
    if (channel.messages.some((m) => m.senderId === "me")) {
      ids.push(channel.id)
    }
  }
  return ids.slice(0, RECENT_CHATS_MAX)
}

export function loadRecentChatIds(channels: ChatChannel[]): string[] {
  try {
    const stored = localStorage.getItem(RECENT_CHATS_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as string[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        const valid = new Set(channels.map((c) => c.id))
        return parsed.filter((id) => valid.has(id)).slice(0, RECENT_CHATS_MAX)
      }
    }
  } catch {
    // ignore
  }
  return seedRecentFromChannels(channels)
}

export function persistRecentChatIds(ids: string[]): void {
  try {
    localStorage.setItem(RECENT_CHATS_KEY, JSON.stringify(ids))
  } catch {
    // ignore
  }
}
