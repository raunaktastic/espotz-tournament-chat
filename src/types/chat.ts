export interface Participant {
  id: string
  name: string
  avatarUrl: string
  isOnline: boolean
  isCurrentUser: boolean
  teamName?: string
}

export type MessageType = "text" | "image" | "system"

export type MatchChatStatus = "upcoming" | "live" | "completed"

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
  isLobby?: boolean
  stageIndex?: number
  stageName?: string
  matchDayId?: string
  matchDayLabel?: string
  matchId?: string
  isUserParticipant?: boolean
  chatEnabled?: boolean
}

export interface MatchChatNode {
  chatId: string
  label: string
  isUserParticipant: boolean
  chatEnabled: boolean
  unreadCount?: number
  status: MatchChatStatus
}

export interface MatchDayNode {
  id: string
  label: string
  matches: MatchChatNode[]
}

export interface StageChatNode {
  id: string
  name: string
  stageIndex: number
  matchDays: MatchDayNode[]
}

export interface TournamentChatTree {
  tournamentId: string
  tournamentName: string
  lobbyChatId: string
  stages: StageChatNode[]
}

export interface ChatBreadcrumbSegment {
  label: string
  chatId?: string
}
