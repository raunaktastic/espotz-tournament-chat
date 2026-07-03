import { ChevronDown, ChevronRight, Megaphone, Swords } from "lucide-react"
import type { TournamentChatTree, MatchChatNode } from "../types/chat"

interface ChatNavigatorSidebarProps {
  tree: TournamentChatTree
  activeChatId: string
  expandedNodes: Set<string>
  onToggleNode: (nodeId: string) => void
  onSelectChat: (chatId: string) => void
  onClose?: () => void
  className?: string
  hideHeader?: boolean
}

function MatchRow({
  match,
  isActive,
  onSelect,
}: {
  match: MatchChatNode
  isActive: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors cursor-pointer ${
        isActive
          ? "bg-indigo-600/25 text-indigo-200"
          : "text-gray-400 hover:bg-[#12162b]/60 hover:text-gray-200"
      }`}
    >
      <Swords className="h-4 w-4 shrink-0 text-indigo-400" />
      <span className="flex-1 truncate font-semibold">{match.label}</span>
      {match.status === "live" && (
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" title="Live" />
      )}
      {match.unreadCount != null && match.unreadCount > 0 && (
        <span className="rounded-full bg-indigo-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
          {match.unreadCount}
        </span>
      )}
    </button>
  )
}

export default function ChatNavigatorSidebar({
  tree,
  activeChatId,
  expandedNodes,
  onToggleNode,
  onSelectChat,
  onClose,
  className = "",
  hideHeader = false,
}: ChatNavigatorSidebarProps) {
  const isTournamentExpanded = expandedNodes.has(tree.tournamentId)

  const handleSelectChat = (chatId: string) => {
    onSelectChat(chatId)
    onClose?.()
  }

  return (
    <div className={`flex flex-col bg-[#0c0f1d] text-left ${className}`}>
      {!hideHeader && (
        <div className="border-b border-[#1f2538] px-4 py-3 shrink-0">
          <span className="text-base font-bold tracking-wide text-white">Chat Navigator</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3">
        {/* Tournament root */}
        <div>
          <button
            type="button"
            onClick={() => onToggleNode(tree.tournamentId)}
            className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm font-bold text-white hover:bg-[#12162b]/50 transition-colors cursor-pointer"
          >
            {isTournamentExpanded ? (
              <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
            )}
            <span className="truncate">{tree.tournamentName}</span>
          </button>

          {isTournamentExpanded && (
            <div className="ml-3 mt-0.5 space-y-0.5 border-l border-[#1f2942]/50 pl-2">
              {/* Tournament Lobby */}
              <button
                type="button"
                onClick={() => handleSelectChat(tree.lobbyChatId)}
                className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors cursor-pointer ${
                  activeChatId === tree.lobbyChatId
                    ? "bg-indigo-600/25 text-indigo-200"
                    : "text-gray-400 hover:bg-[#12162b]/60 hover:text-gray-200"
                }`}
              >
                <Megaphone className="h-4 w-4 shrink-0 text-purple-400" />
                <span className="font-semibold">Tournament Lobby</span>
              </button>

              {/* Stages */}
              {tree.stages.map((stage) => {
                const isStageExpanded = expandedNodes.has(stage.id)

                return (
                  <div key={stage.id}>
                    <button
                      type="button"
                      onClick={() => onToggleNode(stage.id)}
                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm font-bold text-gray-300 hover:bg-[#12162b]/50 transition-colors cursor-pointer"
                    >
                      {isStageExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-500" />
                      )}
                      <span className="truncate">{stage.name}</span>
                    </button>

                    {isStageExpanded && (
                      <div className="ml-3 mt-0.5 space-y-1 border-l border-[#1f2942]/40 pl-2">
                        {stage.matchDays.map((day) => {
                          const isDayExpanded = expandedNodes.has(day.id)

                          return (
                            <div key={day.id}>
                              <button
                                type="button"
                                onClick={() => onToggleNode(day.id)}
                                className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-semibold text-gray-500 hover:bg-[#12162b]/40 hover:text-gray-400 transition-colors cursor-pointer"
                              >
                                {isDayExpanded ? (
                                  <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                                ) : (
                                  <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                                )}
                                <span className="truncate">{day.label}</span>
                              </button>

                              {isDayExpanded && (
                                <div className="ml-2 mt-0.5 space-y-0.5">
                                  {day.matches.map((m) => (
                                    <MatchRow
                                      key={m.chatId}
                                      match={m}
                                      isActive={activeChatId === m.chatId}
                                      onSelect={() => handleSelectChat(m.chatId)}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
