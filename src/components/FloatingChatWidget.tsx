import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import {
  MessageSquare,
  X,
  Send,
  Megaphone,
  Swords,
  Users,
} from "lucide-react"
import { mockChats } from "../data/mockChatData"
import { currentUser } from "../data/tournamentPlayers"
import {
  mockTournamentChatTree,
  findChatPath,
} from "../data/chatNavigatorMock"
import { getChatHeaderParts } from "../lib/chatHeader"
import {
  loadRecentChatIds,
  persistRecentChatIds,
  touchRecent,
  MESSAGE_WINDOW_SIZE,
} from "../lib/recentChats"
import type { ChatChannel, Message } from "../types/chat"

interface FloatingChatWidgetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Open directly into this conversation (e.g. after minimize from full page) */
  initialChannelId?: string
}

export default function FloatingChatWidget({
  open: controlledOpen,
  onOpenChange,
  initialChannelId,
}: FloatingChatWidgetProps) {
  const isControlled = controlledOpen !== undefined
  const [internalOpen, setInternalOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const isOpen = isControlled ? controlledOpen : internalOpen

  const setOpen = (next: boolean) => {
    if (isControlled) onOpenChange?.(next)
    else setInternalOpen(next)
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setOpen(false)
      setIsClosing(false)
    }, 300)
  }

  const [channels, setChannels] = useState<ChatChannel[]>(mockChats)
  const [activeChannelId, setActiveChannelId] = useState("tournament")

  // When opened via minimize from full chat, land on that conversation
  useEffect(() => {
    if (!isOpen) return
    if (initialChannelId) {
      setActiveChannelId(initialChannelId)
    }
  }, [isOpen, initialChannelId])
  const [inputText, setInputText] = useState("")
  const [recentIds, setRecentIds] = useState(() => loadRecentChatIds(mockChats))
  const [visibleCount, setVisibleCount] = useState(MESSAGE_WINDOW_SIZE)
  const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0]

  const breadcrumbSegments = useMemo(
    () => findChatPath(mockTournamentChatTree, activeChannelId),
    [activeChannelId]
  )

  const chatTitleParts = useMemo(
    () =>
      getChatHeaderParts(activeChannel.isLobby, activeChannel.name, breadcrumbSegments),
    [activeChannel.isLobby, activeChannel.name, breadcrumbSegments]
  )

  const visibleMessages = useMemo(
    () => activeChannel.messages.slice(-visibleCount),
    [activeChannel.messages, visibleCount]
  )

  const onlineCount = activeChannel.participants.filter((p) => p.isOnline).length

  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current
    if (!container) return
    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight
    })
  }, [])

  useEffect(() => {
    persistRecentChatIds(recentIds)
  }, [recentIds])

  useEffect(() => {
    setVisibleCount(MESSAGE_WINDOW_SIZE)
    scrollToBottom()
  }, [activeChannelId, scrollToBottom])

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

    setChannels((prev) =>
      prev.map((c) =>
        c.id === activeChannelId ? { ...c, messages: [...c.messages, newMessage] } : c
      )
    )
    setRecentIds((prev) => touchRecent(activeChannelId, prev))
    setInputText("")
    requestAnimationFrame(() => scrollToBottom())
  }

  const handleOpen = () => {
    setOpen(true)
  }

  return (
    <>
      {/* Floating action button */}
      {!isOpen && (
        <button
          type="button"
          onClick={handleOpen}
          className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-900/50 transition-transform hover:scale-105 active:scale-95 cursor-pointer md:bottom-6 md:right-6"
          aria-label="Open chats"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Messenger-style drawer */}
      {isOpen && (
        <>
          <div 
            className="fixed top-16 right-0 bottom-0 left-0 z-50 bg-black/50 animate-fade-in"
            onClick={handleClose}
          />
          <div className={`fixed top-16 right-0 bottom-0 z-50 flex h-[calc(100vh-4rem)] w-full max-w-[400px] flex-col border-l border-purple-500/30 bg-[#0c0f1d] shadow-2xl shadow-black/60 md:max-w-[400px] sm:max-w-[350px] ${isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'}`}>
              <div className="flex shrink-0 items-center gap-2 border-b border-purple-500/20 px-2 py-2">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    chatTitleParts.isLobby
                      ? "bg-purple-600/25 text-purple-300"
                      : "bg-gradient-to-br from-purple-600 to-indigo-600 text-white"
                  }`}
                >
                  {chatTitleParts.isLobby ? (
                    <Megaphone className="h-3.5 w-3.5" />
                  ) : (
                    <Swords className="h-3.5 w-3.5" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold text-white">
                    {chatTitleParts.primary}
                  </p>
                  {chatTitleParts.secondary && (
                    <p className="truncate text-[10px] font-bold uppercase tracking-wider text-purple-300">
                      {chatTitleParts.secondary}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsSidebarDrawerOpen(true)}
                  className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-medium transition-colors cursor-pointer text-gray-400 hover:bg-[#141829] hover:text-white"
                  aria-label="Show players list"
                >
                  <Users className="h-4 w-4" />
                  <span className="text-emerald-400">{onlineCount}</span>
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-purple-500/10 hover:text-white cursor-pointer"
                  aria-label="Close chats"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div
                ref={messagesContainerRef}
                className="min-h-0 flex-1 space-y-2.5 overflow-y-auto p-3"
              >
                {visibleMessages.length === 0 ? (
                  <p className="py-8 text-center text-xs text-gray-500">
                    No messages yet. Say GLHF!
                  </p>
                ) : (
                  visibleMessages.map((msg) => {
                    const isOwn = msg.senderId === "me"
                    if (msg.type === "system") {
                      return (
                        <div key={msg.id} className="flex justify-center">
                          <span className="rounded-full border border-[#1f2942] bg-[#12162b]/60 px-2.5 py-0.5 text-[10px] text-gray-400">
                            {msg.content}
                          </span>
                        </div>
                      )
                    }
                    return (
                      <div
                        key={msg.id}
                        className={`flex items-end gap-1.5 ${isOwn ? "justify-end" : "justify-start"}`}
                      >
                        {!isOwn && (
                          <img
                            src={msg.senderAvatarUrl}
                            alt={msg.senderName}
                            className="h-6 w-6 shrink-0 rounded-full ring-1 ring-purple-500/30 object-cover"
                          />
                        )}
                        <div
                          className={`max-w-[80%] rounded-2xl px-3 py-1.5 text-xs ${
                            isOwn
                              ? "rounded-br-sm bg-purple-600 text-white"
                              : "rounded-bl-sm border border-purple-500/25 bg-gray-900/70 text-gray-100"
                          }`}
                        >
                          {!isOwn && (
                            <p className="mb-0.5 text-[9px] font-medium text-gray-500">
                              {msg.senderName}
                            </p>
                          )}
                          <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                          <p
                            className={`mt-0.5 text-[9px] ${isOwn ? "text-purple-200/70" : "text-gray-600"}`}
                          >
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="shrink-0 border-t border-purple-500/20 p-2">
                <div className="flex items-end gap-1.5 rounded-xl border border-purple-500/25 bg-gray-900/50 p-1 focus-within:border-purple-400/50">
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
                    className="max-h-16 flex-1 resize-none bg-transparent px-2 py-1.5 text-xs text-white placeholder-gray-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={!inputText.trim()}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all cursor-pointer ${
                      inputText.trim()
                        ? "bg-purple-600 text-white hover:bg-purple-500"
                        : "bg-[#12162b] text-gray-600 cursor-not-allowed"
                    }`}
                    aria-label="Send message"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Online Players sidebar drawer */}
              {isSidebarDrawerOpen && (
                <div 
                  className="absolute inset-0 z-50 flex justify-end bg-black/60 animate-fade-in"
                  onClick={() => setIsSidebarDrawerOpen(false)}
                >
                  <div 
                    className="flex h-full w-full max-w-sm flex-col border-l border-purple-500/20 bg-[#0c0f1d] animate-slide-in-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex shrink-0 flex-col border-b border-purple-500/20 px-4 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600/20 text-purple-300">
                            <Users className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white">Online Players</p>
                            <p className="text-[11px] text-gray-500">
                              <span className="text-emerald-400">{onlineCount}</span> online
                              <span className="text-gray-600"> · </span>
                              {activeChannel.participants.length} total
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsSidebarDrawerOpen(false)}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-purple-500/10 hover:text-white cursor-pointer"
                          aria-label="Close"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto px-3 py-3">
                      {activeChannel.participants.map((player) => (
                        <div
                          key={player.id}
                          className="flex items-center gap-3 rounded-lg border border-white/5 bg-[#12162b]/50 px-3 py-2 mb-2"
                        >
                          <div className="relative shrink-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600 text-sm font-bold text-white">
                              {player.name.charAt(0).toUpperCase()}
                            </div>
                            <span
                              className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-[#0c0f1d] ${
                                player.isOnline ? "bg-emerald-500" : "bg-red-500"
                              }`}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-white">{player.name}</p>
                            {player.isCurrentUser && (
                              <span className="text-[10px] font-semibold uppercase text-purple-300">You</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
        </div>
        </>
      )}
    </>
  )
}
