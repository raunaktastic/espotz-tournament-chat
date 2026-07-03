import { useState, useRef, useEffect, useCallback } from "react"
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
  getAutoExpandNodeIds,
} from "../data/chatNavigatorMock"
import ConnectedPlayersBar from "../components/ConnectedPlayersBar"
import ChatNavigatorSidebar from "../components/ChatNavigatorSidebar"
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

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
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
    <div className="flex h-[calc(100vh-73px)] bg-[#080a12] text-white overflow-hidden">
      {/* Left: Chat column (header + messages + input) */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <header className="flex min-h-16 items-center justify-between border-b border-[#1f2538]/50 bg-[#0c0f1d]/80 backdrop-blur-md px-4 md:px-6 z-10 shrink-0 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate("/")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#1f2942] bg-[#0c0f1d] hover:bg-[#141829] hover:border-[#2a3555] text-gray-400 hover:text-white transition-all duration-200 cursor-pointer interactive"
            aria-label="Back to tournament"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#141829] to-[#0f1220] border border-[#1f2942] shadow-sm">
            {renderChannelIcon(activeChannel.iconType, "h-5 w-5")}
          </div>

          <div className="text-left min-w-0 flex-1">
            <h1 className="text-sm font-semibold text-white leading-tight truncate mb-0.5">
              {mockTournamentChatTree.tournamentName}
            </h1>
            <p className="text-xs text-gray-400 truncate">{activeChannel.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsNavigatorOpen(!isNavigatorOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1f2942] bg-[#0c0f1d] hover:bg-[#141829] hover:border-[#2a3555] text-gray-400 hover:text-white lg:hidden transition-all duration-200 cursor-pointer interactive"
            aria-label="Open chat navigator"
          >
            <PanelRight className="h-4 w-4" />
          </button>

          <div className="relative">
            <button
              onClick={() => setActiveMenu(!activeMenu)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1f2942] bg-[#0c0f1d] hover:bg-[#141829] hover:border-[#2a3555] text-gray-400 hover:text-white transition-all duration-200 cursor-pointer interactive"
              aria-label="Chat options"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {activeMenu && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-[#1f2942] bg-[#0c0f1d] py-2 shadow-xl z-50 animate-scale-in">
                <button
                  onClick={() => {
                    setActiveMenu(false)
                    alert("Chat notification settings updated!")
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-[#141829] transition-colors duration-150 flex items-center gap-3 text-gray-300 hover:text-white"
                >
                  <span className="text-gray-400">🔔</span>
                  Mute Notifications
                </button>
                <button
                  onClick={() => {
                    setActiveMenu(false)
                    alert("Chat logs cleared locally.")
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-[#141829] transition-colors duration-150 flex items-center gap-3 text-red-400 hover:text-red-300"
                >
                  <span>🗑️</span>
                  Clear Chat Logs
                </button>
                <div className="border-t border-[#1f2942] my-1" />
                <button
                  onClick={() => {
                    setActiveMenu(false)
                    alert("Chat settings opened.")
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-[#141829] transition-colors duration-150 flex items-center gap-3 text-gray-300 hover:text-white"
                >
                  <span className="text-gray-400">⚙️</span>
                  Chat Settings
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

          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#080a12]">
            {activeChannel.messages.map((msg, index) => {
              const isOwn = msg.senderId === "me"
              const prevMsg = activeChannel.messages[index - 1]
              const isGrouped = prevMsg && prevMsg.senderId === msg.senderId && prevMsg.type !== "system"

              if (msg.type === "system") {
                return (
                  <div key={msg.id} className="flex justify-center my-6">
                    <span className="rounded-lg border border-[#1f2942]/40 bg-[#12162b]/80 backdrop-blur-sm px-4 py-2 text-xs font-medium tracking-wide text-gray-400 shadow-sm">
                      {msg.content}
                    </span>
                  </div>
                )
              }

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-3 text-left ${isOwn ? "justify-end" : "justify-start"} ${isGrouped ? "mt-1" : "mt-5"}`}
                >
                  {!isOwn && !isGrouped && (
                    <div className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-indigo-500/20 shrink-0">
                      <img
                        src={msg.senderAvatarUrl}
                        alt={msg.senderName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  {!isOwn && isGrouped && (
                    <div className="h-9 w-9 shrink-0" />
                  )}

                  <div className={`max-w-[70%] md:max-w-[60%] flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                    {!isOwn && !isGrouped && (
                      <div className="flex items-center gap-2 mb-1.5 ml-0.5">
                        <span className="text-xs font-semibold text-gray-300">
                          {msg.senderName}
                        </span>
                        <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
                      </div>
                    )}

                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-all duration-200 ${
                        isOwn
                          ? "bg-indigo-600 text-white rounded-br-md hover:bg-indigo-500"
                          : "bg-[#1a1f35] border border-[#2a3555]/50 text-gray-100 rounded-bl-md hover:bg-[#1f2540] hover:border-[#3a4565]"
                      } ${isGrouped ? "rounded-tl-md rounded-tr-md" : ""}`}
                    >
                      {msg.type === "image" ? (
                        <div className="space-y-2">
                          <p className="leading-relaxed">{msg.content}</p>
                          <div className="overflow-hidden rounded-lg border border-white/10 max-w-full group cursor-pointer">
                            <img
                              src={msg.imageUrl}
                              alt="Attached media"
                              className="max-h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>

                    {isOwn && !isGrouped && (
                      <span className="text-[10px] text-gray-500 mt-1 mr-0.5 flex items-center gap-1">
                        {msg.timestamp}
                        <span className="text-indigo-400">✓</span>
                      </span>
                    )}
                  </div>

                  {isOwn && !isGrouped && (
                    <div className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-purple-500/20 shrink-0">
                      <img
                        src={msg.senderAvatarUrl}
                        alt={msg.senderName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  {isOwn && isGrouped && (
                    <div className="h-9 w-9 shrink-0" />
                  )}
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-[#1f2538]/50 bg-[#0c0f1d]/95 backdrop-blur-sm p-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-3 mb-3">
              {["GG", "WP", "RE?", "NICE", "🔥", "RUSH"].map((pill) => (
                <button
                  key={pill}
                  onClick={() => handleQuickReply(pill)}
                  className="rounded-full border border-[#1f2942]/60 bg-[#12162b] px-3 py-1 text-xs font-medium text-gray-400 transition-all duration-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 cursor-pointer whitespace-nowrap"
                >
                  {pill}
                </button>
              ))}
            </div>

            <div className="flex items-end gap-2 bg-[#0a0d18] border border-[#1f2942]/50 rounded-xl p-2 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all duration-200">
              <button
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-[#12162b] transition-all duration-200 cursor-pointer"
                title="Attach file (placeholder)"
              >
                <Paperclip className="h-4 w-4" />
              </button>

              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={handleTextareaChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder="Type a message..."
                rows={1}
                className="flex-1 max-h-28 bg-transparent py-2 px-2 text-sm text-white placeholder-gray-500 outline-none resize-none align-bottom scrollbar-none leading-relaxed"
              />

              <button
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-[#12162b] transition-all duration-200 cursor-pointer"
                title="Emoji picker (placeholder)"
              >
                <span className="text-base">😊</span>
              </button>

              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-200 cursor-pointer ${
                  inputText.trim()
                    ? "bg-indigo-600 text-white hover:bg-indigo-500"
                    : "bg-[#12162b] text-gray-500 cursor-not-allowed"
                }`}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Navigator drawer (Mobile/Tablet) */}
          {isNavigatorOpen && (
            <div 
              className="lg:hidden absolute inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all duration-300 flex justify-end animate-fade-in"
              onClick={() => setIsNavigatorOpen(false)}
            >
              <div 
                className="w-full max-w-sm h-full flex flex-col border-l border-[#1f2538] animate-slide-in-right bg-[#0c0f1d]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-[#1f2538] bg-[#0c0f1d] px-4 py-4">
                  <span className="text-base font-bold text-white">Chat Navigator</span>
                  <button
                    onClick={() => setIsNavigatorOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-[#12162b] text-gray-400 hover:text-white transition-all duration-200 cursor-pointer"
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
        className="hidden lg:flex w-72 shrink-0 border-l border-[#1f2538]/50 h-full"
      />
    </div>
  )
}
