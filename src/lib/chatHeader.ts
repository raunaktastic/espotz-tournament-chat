import type { ChatBreadcrumbSegment } from "../types/chat"

export function getChatHeaderTitle(
  isLobby: boolean | undefined,
  channelName: string,
  segments: ChatBreadcrumbSegment[]
): string {
  const parts = getChatHeaderParts(isLobby, channelName, segments)
  return parts.secondary ? `${parts.primary} ┬╖ ${parts.secondary}` : parts.primary
}

export function getChatHeaderParts(
  isLobby: boolean | undefined,
  channelName: string,
  segments: ChatBreadcrumbSegment[]
): { primary: string; secondary?: string; isLobby: boolean } {
  if (isLobby) {
    return { primary: "Tournament Lobby", isLobby: true }
  }

  if (segments.length >= 3) {
    const stage = segments[1]?.label
    const leaf = segments[segments.length - 1]?.label
    if (stage && leaf) {
      return { primary: leaf, secondary: stage, isLobby: false }
    }
  }

  return { primary: channelName, isLobby: false }
}
