import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Megaphone,
  Swords,
  Trophy,
  MoreVertical,
  Paperclip,
  Send,
  PanelRight,
  X,
} from "lucide-react"
import { mockChats } from "../data/mockChatData"
import { currentUser } from "../data/tournamentPlayers"
import {
  mockTournamentChatTree,
  getVisibleNavigatorTree,
  findChatPath,
  getAutoExpandNodeIds,
} from "../data/chatNavigatorMock"
import ConnectedPlayersBar from "../components/ConnectedPlayersBar"
import ChatNavigatorSidebar from "../components/ChatNavigatorSidebar"
import ChatBreadcrumb from "../components/ChatBreadcrumb"
import type { ChatChannel, Message } from "../types/chat"

const visibleTree = getVisibleNavigatorTree(mockTournamentChatTree)

function loadExpandedNodes(): Set<string> {
  try {
    const stored = localStorage.getItem("chat-nav-expanded")
    if (stored) {
      return new Set(JSON.parse(stored) as string[])
    }
  } catch {
    // ignore
  }
  return new Set([mockTournamentChatTree.tournamentId])
}

export default function ChatPage() {
  const navigate = useNavigate()
  const [channels, setChannels] = useState<ChatChannel[]>(mockChats)
  const [activeChannelId, setActiveChannelId] = useState<string>("tournament")
  const [inputText, setInputText] = useState<string>("")
  const [isNavigatorOpen, setIsNavigatorOpen] = useState<boolean>(false)
  const [activeMenu, setActiveMenu] = useState<boolean>(false)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(loadExpandedNodes)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0]

  const breadcrumbSegments = useMemo(
    () => findChatPath(mockTournamentChatTree, activeChannelId),
    [activeChannelId]
  )

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activeChannelId, activeChannel.messages])

  useEffect(() => {
    const autoIds = getAutoExpandNodeIds(mockTournamentChatTree, activeChannelId)
    setExpandedNodes((prev) => {
      const next = new Set(prev)
      autoIds.forEach((id) => next.add(id))
      return next
    })
  }, [activeChannelId])

  useEffect(() => {
    localStorage.setItem("chat-nav-expanded", JSON.stringify([...expandedNodes]))
  }, [expandedNodes])

  const handleToggleNode = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev)
      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
      }
      return next
    })
  }, [])

  const handleSelectChat = useCallback((chatId: string) => {
    setActiveChannelId(chatId)
  }, [])

  const handleSendMessage = () => {
    if (!inputText.trim()) return

    const newMessage: Message = {
      id: `user_${Date.now()}`,
      senderId: "me",
      senderName: currentUser.name,
      senderAvatarUrl: currentUser.avatarUrl,
      content: inputText,
      type: "text",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setChannels((prevChannels) =>
      prevChannels.map((c) => {
        if (c.id === activeChannelId) {
          return {
            ...c,
            messages: [...c.messages, newMessage],
          }
        }
        return c
      })
    )
    setInputText("")
  }

  const handleQuickReply = (pill: string) => {
    setInputText((prev) => (prev ? prev + " " + pill : pill))
  }

  const renderChannelIcon = (iconType: string, className: string = "h-5 w-5") => {
    switch (iconType) {
      case "megaphone":
        return <Megaphone className={`${className} text-purple-400`} />
      case "swords":
        return <Swords className={`${className} text-indigo-400`} />
      case "trophy":
        return <Trophy className={`${className} text-yellow-400`} />
      default:
        return <Megaphone className={`${className} text-purple-400`} />
    }
  }

  const playersBarLabel = activeChannel.isLobby
    ? "Tournament Players (16 Teams)"
    : `${activeChannel.stageName ?? "Match"} · ${activeChannel.name}`

  return (
    <div className="flex h-screen bg-[#080a12] text-white overflow-hidden">
      {/* Left: Chat column (header + messages + input) */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <header className="flex min-h-16 items-center justify-between border-b border-[#1f2538] bg-[#0c0f1d] px-4 py-2 md:px-6 z-10 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate("/")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#1f2942] bg-[#0c0f1d] hover:bg-[#141829] text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#141829] border border-[#1f2942]">
            {renderChannelIcon(activeChannel.iconType)}
          </div>

          <div className="text-left min-w-0">
            <h1 className="text-sm font-bold text-white leading-tight truncate">
              {mockTournamentChatTree.tournamentName}
            </h1>
            <p className="text-xs text-gray-400 truncate">{activeChannel.subtitle}</p>
            <ChatBreadcrumb segments={breadcrumbSegments} />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsNavigatorOpen(!isNavigatorOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1f2942] bg-[#0c0f1d] hover:bg-[#141829] text-gray-400 hover:text-white lg:hidden transition-all cursor-pointer"
            aria-label="Open chat navigator"
          >
            <PanelRight className="h-4.5 w-4.5" />
          </button>

          <div className="relative">
            <button
              onClick={() => setActiveMenu(!activeMenu)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1f2942] bg-[#0c0f1d] hover:bg-[#141829] text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              <MoreVertical className="h-4.5 w-4.5" />
            </button>

            {activeMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-[#1f2942] bg-[#0c0f1d] py-1 shadow-2xl z-50">
                <button
                  onClick={() => {
                    setActiveMenu(false)
                    alert("Chat notification settings updated!")
                  }}
                  className="w-full px-4 py-2 text-left text-xs hover:bg-[#141829] transition-colors"
                >
                  Mute Notifications
                </button>
                <button
                  onClick={() => {
                    setActiveMenu(false)
                    alert("Chat logs cleared locally.")
                  }}
                  className="w-full px-4 py-2 text-left text-xs hover:bg-[#141829] transition-colors text-red-400"
                >
                  Clear Chat Logs
                </button>
              </div>
            )}
          </div>
        </div>
        </header>

        <div className="flex flex-1 flex-col overflow-hidden relative min-h-0">
          <ConnectedPlayersBar
            participants={activeChannel.participants}
            label={playersBarLabel}
          />

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-radial from-[#0c0f1d] to-[#080a12]">
            {activeChannel.messages.map((msg) => {
              const isOwn = msg.senderId === "me"

              if (msg.type === "system") {
                return (
                  <div key={msg.id} className="flex justify-center my-3">
                    <span className="rounded-full border border-[#1f2942]/50 bg-[#12162b]/80 px-3.5 py-1 text-[11px] font-semibold tracking-wide text-gray-400 shadow-sm">
                      {msg.content}
                    </span>
                  </div>
                )
              }

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 text-left ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  {!isOwn && (
                    <div className="h-8.5 w-8.5 overflow-hidden rounded-full ring-2 ring-indigo-500/30 shrink-0">
                      <img
                        src={msg.senderAvatarUrl}
                        alt={msg.senderName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className={`max-w-[70%] flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                    {!isOwn && (
                      <span className="text-[10px] font-bold text-gray-400 mb-1 ml-1">
                        {msg.senderName}
                      </span>
                    )}

                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm shadow-md transition-all ${
                        isOwn
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-[#13182d] border border-[#1f2942]/70 text-gray-100 rounded-bl-none"
                      }`}
                    >
                      {msg.type === "image" ? (
                        <div className="space-y-1.5">
                          <p className="leading-relaxed">{msg.content}</p>
                          <div className="overflow-hidden rounded-lg border border-white/10 max-w-full">
                            <img
                              src={msg.imageUrl}
                              alt="Attached media"
                              className="max-h-48 w-full object-cover cursor-pointer hover:scale-105 transition-all"
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>

                    <span className="text-[9px] text-gray-500 mt-1 ml-1 mr-1">
                      {msg.timestamp}
                    </span>
                  </div>

                  {isOwn && (
                    <div className="h-8.5 w-8.5 overflow-hidden rounded-full ring-2 ring-purple-500/30 shrink-0">
                      <img
                        src={msg.senderAvatarUrl}
                        alt={msg.senderName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-[#1f2538] bg-[#0c0f1d] p-3 md:p-4">
            <div className="flex space-x-1.5 overflow-x-auto scrollbar-none pb-2.5 mb-1.5">
              {["GG", "WP", "RE?", "NICE", "🔥", "RUSH"].map((pill) => (
                <button
                  key={pill}
                  onClick={() => handleQuickReply(pill)}
                  className="rounded-full border border-[#1f2942] bg-[#12162b] px-3.5 py-1 text-xs font-bold text-gray-300 transition-all hover:bg-indigo-600 hover:text-white hover:border-indigo-600 cursor-pointer"
                >
                  {pill}
                </button>
              ))}
            </div>

            <div className="flex items-end gap-2.5 bg-[#090b14] border border-[#1f2942] rounded-xl p-2 focus-within:border-indigo-500 transition-all">
              <button className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-[#12162b] transition-all cursor-pointer">
                <Paperclip className="h-4.5 w-4.5" />
              </button>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder="Type a message..."
                rows={1}
                className="flex-1 max-h-20 bg-transparent py-1 px-1 text-sm text-white placeholder-gray-500 outline-none resize-none align-bottom scrollbar-none"
              />

              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all cursor-pointer ${
                  inputText.trim()
                    ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/25"
                    : "bg-[#12162b] text-gray-500 cursor-not-allowed"
                }`}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Navigator drawer (Mobile/Tablet) */}
          {isNavigatorOpen && (
            <div className="lg:hidden absolute inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all flex justify-end">
              <div className="w-80 h-full flex flex-col border-l border-[#1f2538] animate-slide-in bg-[#0c0f1d]">
                <div className="flex items-center justify-between border-b border-[#1f2538] bg-[#0c0f1d] px-4 py-3">
                  <span className="text-base font-bold text-white">Chat Navigator</span>
                  <button
                    onClick={() => setIsNavigatorOpen(false)}
                    className="p-1 hover:bg-[#12162b] rounded-lg text-gray-400 hover:text-white transition-all cursor-pointer"
                    aria-label="Close chat navigator"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <ChatNavigatorSidebar
                  tree={visibleTree}
                  activeChatId={activeChannelId}
                  expandedNodes={expandedNodes}
                  onToggleNode={handleToggleNode}
                  onSelectChat={handleSelectChat}
                  onClose={() => setIsNavigatorOpen(false)}
                  hideHeader
                  className="flex-1 overflow-hidden"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Chat Navigator — full height from top */}
      <ChatNavigatorSidebar
        tree={visibleTree}
        activeChatId={activeChannelId}
        expandedNodes={expandedNodes}
        onToggleNode={handleToggleNode}
        onSelectChat={handleSelectChat}
        className="hidden lg:flex w-80 shrink-0 border-l border-[#1f2538] h-full"
      />
    </div>
  )
}
