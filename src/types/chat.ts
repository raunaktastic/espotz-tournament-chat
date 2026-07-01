export interface Participant {
  id: string
  name: string
  avatarUrl: string
  isOnline: boolean
  isCurrentUser: boolean
}

export type MessageType = "text" | "image" | "system"

export interface Message {
  id: string
  senderId?: string
  senderName?: string
  senderAvatarUrl?: string
  content: string
  type: MessageType
  imageUrl?: string
  timestamp: string
}

export interface ChatChannel {
  id: string
  name: string
  subtitle: string
  iconType: "megaphone" | "swords" | "trophy"
  participants: Participant[]
  messages: Message[]
}
