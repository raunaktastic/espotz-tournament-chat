import { useEffect, useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  Megaphone,
  MessageSquare,
  Swords,
  Trophy,
} from "lucide-react"
import type { TournamentChatTree, MatchChatNode, StageChatNode } from "../types/chat"

export interface RecentChatItem {
  chatId: string
  label: string
  isLobby?: boolean
}

type NavTab = "recent" | "tournament"

interface ChatNavigatorSidebarProps {
  tree: TournamentChatTree
  activeChatId: string
  expandedNodes: Set<string>
  onToggleNode: (nodeId: string) => void
  onSelectChat: (chatId: string) => void
  onClose?: () => void
  className?: string
  hideHeader?: boolean
  recentChats?: RecentChatItem[]
}

/** Shared row styles ΓÇö same size/weight for Recent and Tournament */
const rowBase =
  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-bold text-white transition-colors cursor-pointer"
const rowActive =
  "bg-gradient-to-r from-purple-600/40 to-indigo-600/30 shadow-md shadow-purple-500/20"
const rowIdle = "hover:bg-purple-500/10"
const iconBox =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/20"
const iconBoxActive = "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/30"
const iconClass = "h-4 w-4 text-white"
const badgeClass =
  "shrink-0 rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-200"

function stageMatchCount(stage: StageChatNode): number {
  return stage.matchDays.reduce((sum, day) => sum + day.matches.length, 0)
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
  const isLive = match.status === "live"

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`${rowBase} ${isActive ? rowActive : rowIdle}`}
    >
      <span className={isActive ? iconBoxActive : iconBox}>
        <Swords className={iconClass} />
      </span>
      <span className="min-w-0 flex-1 truncate">{match.label}</span>
      {isLive && (
        <span className="shrink-0 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
          Live
        </span>
      )}
      {match.unreadCount != null && match.unreadCount > 0 && (
        <span className="shrink-0 rounded-full bg-purple-600 px-2 py-0.5 text-[10px] font-bold text-white">
          {match.unreadCount}
        </span>
      )}
    </button>
  )
}

function tabClass(active: boolean) {
  return active
    ? "flex-1 rounded-lg border border-purple-400/50 bg-purple-600/20 px-2 py-1.5 text-sm font-bold text-white transition-colors cursor-pointer"
    : "flex-1 rounded-lg border border-transparent px-2 py-1.5 text-sm font-bold text-gray-400 transition-colors hover:bg-purple-500/10 hover:text-white cursor-pointer"
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
  recentChats = [],
}: ChatNavigatorSidebarProps) {
  const [navTab, setNavTab] = useState<NavTab>(() =>
    recentChats.length > 0 ? "recent" : "tournament"
  )

  const isTournamentExpanded = expandedNodes.has(tree.tournamentId)
  const isLobbyActive = activeChatId === tree.lobbyChatId

  useEffect(() => {
    if (recentChats.some((c) => c.chatId === activeChatId)) {
      setNavTab("recent")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- avoid fighting manual Tournament tab
  }, [activeChatId, recentChats.length])

  const handleSelectChat = (chatId: string) => {
    onSelectChat(chatId)
    onClose?.()
  }

  return (
    <div className={`flex flex-col bg-[#0c0f1d] text-left ${className}`}>
      {!hideHeader && (
        <div className="shrink-0 border-b border-purple-500/20 px-4 pt-3 pb-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/40">
              <MessageSquare className="h-4 w-4" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-white">Chats</span>
          </div>
          <div className="mt-2.5 h-0.5 w-full rounded-full bg-gradient-to-r from-purple-500 to-transparent" />
        </div>
      )}

      <div className="shrink-0 border-b border-purple-500/20 px-3 py-2">
        <div className="flex gap-1.5 rounded-xl border border-purple-500/20 bg-gray-900/50 p-1">
          <button
            type="button"
            onClick={() => setNavTab("recent")}
            className={tabClass(navTab === "recent")}
          >
            Recent
          </button>
          <button
            type="button"
            onClick={() => setNavTab("tournament")}
            className={tabClass(navTab === "tournament")}
          >
            Tournament
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {navTab === "recent" && (
          <div className="overflow-hidden rounded-xl border border-purple-500/20 bg-gray-900/50">
            {recentChats.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm font-bold text-gray-500">
                No recent chats yet. Send a message to add one.
              </p>
            ) : (
              <div className="divide-y divide-white/5 p-1.5">
                {recentChats.map((item) => {
                  const isActive = activeChatId === item.chatId
                  return (
                    <button
                      key={item.chatId}
                      type="button"
                      onClick={() => handleSelectChat(item.chatId)}
                      className={`${rowBase} ${isActive ? rowActive : rowIdle}`}
                    >
                      <span className={isActive ? iconBoxActive : iconBox}>
                        {item.isLobby ? (
                          <Megaphone className={iconClass} />
                        ) : (
                          <Swords className={iconClass} />
                        )}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {navTab === "tournament" && (
          <div className="overflow-hidden rounded-xl border border-purple-500/20 bg-gray-900/50">
            <div className="divide-y divide-white/5 p-1.5">
              <button
                type="button"
                onClick={() => onToggleNode(tree.tournamentId)}
                className={`${rowBase} ${rowIdle}`}
              >
                <span className={iconBox}>
                  <Trophy className={iconClass} />
                </span>
                <span className="min-w-0 flex-1 truncate">{tree.tournamentName}</span>
                {isTournamentExpanded ? (
                  <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
                )}
              </button>

              {isTournamentExpanded && (
                <>
                  <button
                    type="button"
                    onClick={() => handleSelectChat(tree.lobbyChatId)}
                    className={`${rowBase} ${isLobbyActive ? rowActive : rowIdle}`}
                  >
                    <span className={isLobbyActive ? iconBoxActive : iconBox}>
                      <Megaphone className={iconClass} />
                    </span>
                    <span className="min-w-0 flex-1 truncate">Tournament Lobby</span>
                  </button>

                  {tree.stages.map((stage) => {
                    const isStageExpanded = expandedNodes.has(stage.id)
                    const matchCount = stageMatchCount(stage)

                    return (
                      <div key={stage.id}>
                        <button
                          type="button"
                          onClick={() => onToggleNode(stage.id)}
                          className={`${rowBase} ${rowIdle}`}
                        >
                          <span className="min-w-0 flex-1 truncate pl-0">{stage.name}</span>
                          {matchCount > 0 && (
                            <span className={badgeClass}>
                              {matchCount} {matchCount === 1 ? "chat" : "chats"}
                            </span>
                          )}
                          {isStageExpanded ? (
                            <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
                          )}
                        </button>

                        {isStageExpanded &&
                          stage.matchDays.map((day) => {
                            const isDayExpanded = expandedNodes.has(day.id)

                            return (
                              <div key={day.id} className="pl-2">
                                <button
                                  type="button"
                                  onClick={() => onToggleNode(day.id)}
                                  className={`${rowBase} ${rowIdle}`}
                                >
                                  {isDayExpanded ? (
                                    <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
                                  )}
                                  <span className="min-w-0 flex-1 truncate">{day.label}</span>
                                </button>

                                {isDayExpanded && (
                                  <div className="pl-2">
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
                    )
                  })}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
