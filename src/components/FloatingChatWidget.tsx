import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import {
  MessageSquare,
  X,
  ArrowLeft,
  Send,
  ExternalLink,
  Megaphone,
  Swords,
} from "lucide-react"
import { mockChats } from "../data/mockChatData"
import { currentUser } from "../data/tournamentPlayers"
import {
  mockTournamentChatTree,
  getVisibleNavigatorTree,
  findChatPath,
  getAutoExpandNodeIds,
  clearUnreadForChat,
} from "../data/chatNavigatorMock"
import ChatNavigatorSidebar from "./ChatNavigatorSidebar"
import { getChatHeaderTitle, getChatHeaderParts } from "../lib/chatHeader"
import {
  loadRecentChatIds,
  persistRecentChatIds,
  touchRecent,
  MESSAGE_WINDOW_SIZE,
} from "../lib/recentChats"
import type { ChatChannel, Message, TournamentChatTree } from "../types/chat"

type PanelView = "list" | "conversation"

interface FloatingChatWidgetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Open directly into this conversation (e.g. after minimize from full page) */
  initialChannelId?: string
}

function initialNavigatorTree(): TournamentChatTree {
  return clearUnreadForChat(
    getVisibleNavigatorTree(mockTournamentChatTree),
    "tournament"
  )
}

export default function FloatingChatWidget({
  open: controlledOpen,
  onOpenChange,
  initialChannelId,
}: FloatingChatWidgetProps) {
  const navigate = useNavigate()
  const isControlled = controlledOpen !== undefined
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = isControlled ? controlledOpen : internalOpen

  const setOpen = (next: boolean) => {
    if (isControlled) onOpenChange?.(next)
    else setInternalOpen(next)
  }

  const [view, setView] = useState<PanelView>("list")
  const [channels, setChannels] = useState<ChatChannel[]>(mockChats)
  const [activeChannelId, setActiveChannelId] = useState("tournament")

  // When opened via minimize from full chat, land on that conversation
  useEffect(() => {
    if (!isOpen) return
    if (initialChannelId) {
      setActiveChannelId(initialChannelId)
      setView("conversation")
    } else {
      setView("list")
    }
  }, [isOpen, initialChannelId])
  const [navigatorTree, setNavigatorTree] = useState(initialNavigatorTree)
  const [inputText, setInputText] = useState("")
  const [expandedNodes, setExpandedNodes] = useState(
    () => new Set(getAutoExpandNodeIds(mockTournamentChatTree, "tournament"))
  )
  const [recentIds, setRecentIds] = useState(() => loadRecentChatIds(mockChats))
  const [visibleCount, setVisibleCount] = useState(MESSAGE_WINDOW_SIZE)

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

  const recentChats = useMemo(
    () =>
      recentIds
        .map((chatId) => {
          const channel = channels.find((c) => c.id === chatId)
          if (!channel) return null
          const segments = findChatPath(mockTournamentChatTree, chatId)
          return {
            chatId,
            label: getChatHeaderTitle(channel.isLobby, channel.name, segments),
            isLobby: channel.isLobby,
          }
        })
        .filter((item): item is NonNullable<typeof item> => item != null),
    [recentIds, channels]
  )

  const visibleMessages = useMemo(
    () => activeChannel.messages.slice(-visibleCount),
    [activeChannel.messages, visibleCount]
  )

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
    if (view !== "conversation") return
    setVisibleCount(MESSAGE_WINDOW_SIZE)
    setExpandedNodes(
      new Set(getAutoExpandNodeIds(mockTournamentChatTree, activeChannelId))
    )
    setNavigatorTree((prev) => clearUnreadForChat(prev, activeChannelId))
    scrollToBottom()
  }, [activeChannelId, view, scrollToBottom])

  const handleToggleNode = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev)
      if (next.has(nodeId)) next.delete(nodeId)
      else next.add(nodeId)
      return next
    })
  }, [])

  const handleSelectChat = useCallback((chatId: string) => {
    setActiveChannelId(chatId)
    setView("conversation")
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

    setChannels((prev) =>
      prev.map((c) =>
        c.id === activeChannelId ? { ...c, messages: [...c.messages, newMessage] } : c
      )
    )
    setRecentIds((prev) => touchRecent(activeChannelId, prev))
    setInputText("")
    requestAnimationFrame(() => scrollToBottom())
  }

  const handleClose = () => {
    setOpen(false)
    setView("list")
  }

  const handleOpen = () => {
    setOpen(true)
    setView("list")
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

      {/* Messenger-style popup */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 flex h-[min(560px,calc(100vh-7rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-purple-500/30 bg-[#0c0f1d] shadow-2xl shadow-black/60 md:bottom-6 md:right-6">
          {view === "list" ? (
            <>
              <div className="flex shrink-0 items-center justify-between gap-2 border-b border-purple-500/20 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/40">
                    <MessageSquare className="h-4 w-4" />
                  </span>
                  <span className="text-base font-extrabold tracking-tight text-white">
                    Chats
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      handleClose()
                      navigate("/chat")
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-purple-500/10 hover:text-white cursor-pointer"
                    aria-label="Open full chat page"
                    title="Open full page"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-purple-500/10 hover:text-white cursor-pointer"
                    aria-label="Close chats"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <ChatNavigatorSidebar
                tree={navigatorTree}
                activeChatId={activeChannelId}
                expandedNodes={expandedNodes}
                onToggleNode={handleToggleNode}
                onSelectChat={handleSelectChat}
                hideHeader
                recentChats={recentChats}
                className="min-h-0 flex-1 overflow-hidden"
              />
            </>
          ) : (
            <>
              <div className="flex shrink-0 items-center gap-2 border-b border-purple-500/20 px-2 py-2">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-purple-500/10 hover:text-white cursor-pointer"
                  aria-label="Back to chats"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
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
            </>
          )}
        </div>
      )}
    </>
  )
}
