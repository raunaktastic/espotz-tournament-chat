import { useState, useMemo } from "react"
import { ChevronDown, ChevronRight, Megaphone, Swords, Search, X } from "lucide-react"
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
      aria-label={`Select ${match.label}`}
      aria-selected={isActive}
      role="menuitem"
      className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-all duration-200 cursor-pointer ${
        isActive
          ? "bg-indigo-600/20 text-indigo-200 border-l-2 border-indigo-500"
          : "text-gray-400 hover:bg-[#12162b]/50 hover:text-gray-200 border-l-2 border-transparent"
      }`}
    >
      <Swords className="h-4 w-4 shrink-0 text-indigo-400" aria-hidden="true" />
      <span className="flex-1 truncate font-medium">{match.label}</span>
      {match.status === "live" && (
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500 animate-pulse" title="Live" aria-label="Live match" />
      )}
      {match.unreadCount != null && match.unreadCount > 0 && (
        <span className="rounded-full bg-indigo-600 px-1.5 py-0.5 text-[10px] font-semibold text-white" aria-label={`${match.unreadCount} unread messages`}>
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
  const [searchQuery, setSearchQuery] = useState("")
  const isTournamentExpanded = expandedNodes.has(tree.tournamentId)

  const handleSelectChat = (chatId: string) => {
    onSelectChat(chatId)
    onClose?.()
  }

  const filteredTree = useMemo(() => {
    if (!searchQuery.trim()) return tree

    const query = searchQuery.toLowerCase()

    const filterMatchDays = (matchDays: Array<{ id: string; label: string; matches: MatchChatNode[] }>) => {
      return matchDays
        .map((day) => ({
          ...day,
          matches: day.matches.filter((match) =>
            match.label.toLowerCase().includes(query)
          ),
        }))
        .filter((day) => day.matches.length > 0)
    }

    const filteredStages = tree.stages
      .map((stage) => ({
        ...stage,
        matchDays: filterMatchDays(stage.matchDays),
      }))
      .filter((stage) => stage.matchDays.length > 0)

    return {
      ...tree,
      stages: filteredStages,
    }
  }, [searchQuery, tree])

  return (
    <div className={`flex flex-col bg-[#0c0f1d]/90 backdrop-blur-sm text-left ${className}`}>
      {!hideHeader && (
        <div className="border-b border-[#1f2538]/50 px-4 py-3 shrink-0">
          <span className="text-sm font-semibold tracking-wide text-white">Chat Navigator</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="px-3 py-2.5 shrink-0 border-b border-[#1f2538]/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search matches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search matches"
            className="w-full bg-[#0a0d18] border border-[#1f2942]/50 rounded-lg py-2 pl-9 pr-9 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {/* Tournament root */}
        <div>
          <button
            type="button"
            onClick={() => onToggleNode(tree.tournamentId)}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-white hover:bg-[#12162b]/50 transition-colors duration-200 cursor-pointer"
          >
            {isTournamentExpanded ? (
              <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200" />
            )}
            <span className="truncate">{tree.tournamentName}</span>
          </button>

          {isTournamentExpanded && (
            <div className="ml-2 mt-1 space-y-0.5 border-l border-[#1f2942]/30 pl-2">
              {/* Tournament Lobby */}
              <button
                type="button"
                onClick={() => handleSelectChat(tree.lobbyChatId)}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-all duration-200 cursor-pointer ${
                  activeChatId === tree.lobbyChatId
                    ? "bg-indigo-600/20 text-indigo-200 border-l-2 border-indigo-500"
                    : "text-gray-400 hover:bg-[#12162b]/50 hover:text-gray-200 border-l-2 border-transparent"
                }`}
              >
                <Megaphone className="h-4 w-4 shrink-0 text-purple-400" />
                <span className="font-medium">Tournament Lobby</span>
              </button>

              {/* Stages */}
              {filteredTree.stages.map((stage) => {
                const isStageExpanded = expandedNodes.has(stage.id)

                return (
                  <div key={stage.id}>
                    <button
                      type="button"
                      onClick={() => onToggleNode(stage.id)}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-gray-300 hover:bg-[#12162b]/50 transition-colors duration-200 cursor-pointer"
                    >
                      {isStageExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-500 transition-transform duration-200" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-500 transition-transform duration-200" />
                      )}
                      <span className="truncate">{stage.name}</span>
                    </button>

                    {isStageExpanded && (
                      <div className="ml-2 mt-1 space-y-0.5 border-l border-[#1f2942]/20 pl-2">
                        {stage.matchDays.map((day) => {
                          const isDayExpanded = expandedNodes.has(day.id)

                          return (
                            <div key={day.id}>
                              <button
                                type="button"
                                onClick={() => onToggleNode(day.id)}
                                className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-[#12162b]/40 hover:text-gray-400 transition-colors duration-200 cursor-pointer"
                              >
                                {isDayExpanded ? (
                                  <ChevronDown className="h-3 w-3 shrink-0 transition-transform duration-200" />
                                ) : (
                                  <ChevronRight className="h-3 w-3 shrink-0 transition-transform duration-200" />
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
