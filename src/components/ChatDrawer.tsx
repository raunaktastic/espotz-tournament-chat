import { useState, useRef, useEffect } from "react"
import { X, Megaphone, Swords, MoreVertical, Paperclip, Send, Users } from "lucide-react"
import { mockChats } from "../data/mockChatData"
import { currentUser } from "../data/tournamentPlayers"
import type { ChatChannel, Message } from "../types/chat"

interface ChatDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChatDrawer({ isOpen, onClose }: ChatDrawerProps) {
  const [channels, setChannels] = useState<ChatChannel[]>(mockChats)
  const [activeChannelId] = useState<string>("tournament")
  const [inputText, setInputText] = useState<string>("")
  const [activeMenu, setActiveMenu] = useState<boolean>(false)
  const [isTyping, setIsTyping] = useState<boolean>(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activeChannelId, activeChannel.messages])

  // Close on ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  // Close on click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

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
    setIsTyping(e.target.value.length > 0)
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }

  const handleQuickReply = (pill: string) => {
    setInputText((prev) => (prev ? prev + " " + pill : pill))
    textareaRef.current?.focus()
  }

  const renderChannelIcon = (iconType: string, className: string = "h-5 w-5") => {
    switch (iconType) {
      case "megaphone":
        return <Megaphone className={`${className} text-purple-400`} />
      case "swords":
        return <Swords className={`${className} text-indigo-400`} />
      default:
        return <Megaphone className={`${className} text-purple-400`} />
    }
  }

  const onlineCount = activeChannel.participants.filter((p) => p.isOnline).length

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex md:items-center md:justify-end items-end justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleBackdropClick}
    >
      {/* Desktop: 430px, Tablet: 50%, Mobile: Bottom sheet */}
      <div
        ref={drawerRef}
        className="h-full w-full max-w-[430px] bg-[#080a12] shadow-2xl flex flex-col transition-transform duration-300 ease-out md:w-1/2 lg:max-w-[430px] md:h-full md:max-h-full max-h-[85vh] rounded-t-2xl md:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#1f2538]/50 bg-[#0c0f1d] px-4 py-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#141829] to-[#0f1220] border border-[#1f2942]">
              {renderChannelIcon(activeChannel.iconType, "h-5 w-5")}
            </div>
            <div className="text-left min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-white truncate">DemonlLord Tournament</h2>
              <p className="text-xs text-gray-400 truncate">{activeChannel.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <button
                onClick={() => setActiveMenu(!activeMenu)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1f2942] bg-[#0c0f1d] hover:bg-[#141829] text-gray-400 hover:text-white transition-all duration-200"
              >
                <MoreVertical className="h-4 w-4" />
              </button>

              {activeMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-[#1f2942] bg-[#0c0f1d] py-2 shadow-xl z-50">
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-[#141829] text-gray-300 hover:text-white flex items-center gap-3">
                    <span className="text-gray-400">🔔</span>
                    Mute Notifications
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-[#141829] text-red-400 hover:text-red-300 flex items-center gap-3">
                    <span>🗑️</span>
                    Clear Chat
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#141829] text-gray-400 hover:text-white transition-all duration-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Online Players Bar */}
        <div className="border-b border-[#1f2538]/50 bg-[#0a0d18]/80 px-4 py-2 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-gray-500" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                Online Players
              </span>
            </div>
            <span className="text-[10px] font-medium text-emerald-400">{onlineCount} online</span>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {activeChannel.participants.slice(0, 6).map((player) => (
              <div
                key={player.id}
                className="flex shrink-0 items-center gap-2 rounded-full border border-[#1f2942]/40 bg-[#12162b] px-2 py-1"
              >
                <div className={`h-1.5 w-1.5 rounded-full ${player.isOnline ? "bg-emerald-500" : "bg-gray-500"}`} />
                <span className="max-w-[60px] truncate text-[10px] font-medium text-gray-300">
                  {player.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pinned Announcement */}
        <div className="border-b border-[#1f2538]/30 bg-purple-500/5 px-4 py-2 shrink-0">
          <div className="flex items-start gap-2">
            <span className="text-purple-400">📌</span>
            <p className="text-xs text-purple-200/80">
              Welcome to the tournament chat! Please be respectful and follow the rules.
            </p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#080a12]">
          {activeChannel.messages.map((msg, index) => {
            const isOwn = msg.senderId === "me"
            const prevMsg = activeChannel.messages[index - 1]
            const isGrouped = prevMsg && prevMsg.senderId === msg.senderId && prevMsg.type !== "system"

            if (msg.type === "system") {
              return (
                <div key={msg.id} className="flex justify-center my-6">
                  <span className="rounded-lg border border-[#1f2942]/40 bg-[#12162b]/80 px-4 py-2 text-xs font-medium text-gray-400">
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
                  <div className="h-8 w-8 overflow-hidden rounded-full ring-2 ring-indigo-500/20 shrink-0">
                    <img src={msg.senderAvatarUrl} alt={msg.senderName} className="h-full w-full object-cover" />
                  </div>
                )}

                {!isOwn && isGrouped && <div className="h-8 w-8 shrink-0" />}

                <div className={`max-w-[85%] flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                  {!isOwn && !isGrouped && (
                    <div className="flex items-center gap-2 mb-1.5 ml-0.5">
                      <span className="text-xs font-semibold text-gray-300">{msg.senderName}</span>
                      <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-3 py-2 text-sm shadow-sm transition-all duration-200 ${
                      isOwn
                        ? "bg-indigo-600 text-white rounded-br-md"
                        : "bg-[#1a1f35] border border-[#2a3555]/50 text-gray-100 rounded-bl-md"
                    } ${isGrouped ? "rounded-tl-md rounded-tr-md" : ""}`}
                  >
                    {msg.type === "image" ? (
                      <div className="space-y-2">
                        <p className="leading-relaxed">{msg.content}</p>
                        <div className="overflow-hidden rounded-lg border border-white/10 max-w-full">
                          <img src={msg.imageUrl} alt="Attached media" className="max-h-48 w-full object-cover" />
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
                  <div className="h-8 w-8 overflow-hidden rounded-full ring-2 ring-purple-500/20 shrink-0">
                    <img src={msg.senderAvatarUrl} alt={msg.senderName} className="h-full w-full object-cover" />
                  </div>
                )}

                {isOwn && isGrouped && <div className="h-8 w-8 shrink-0" />}
              </div>
            )
          })}
          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span>Someone is typing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-[#1f2538]/50 bg-[#0c0f1d]/95 p-4 shrink-0">
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-3 mb-3">
            {["GG", "GLHF", "WP", "Nice", "Rush", "Need Admin"].map((pill) => (
              <button
                key={pill}
                onClick={() => handleQuickReply(pill)}
                className="rounded-full border border-[#1f2942]/60 bg-[#12162b] px-3 py-1 text-xs font-medium text-gray-400 transition-all duration-200 hover:bg-indigo-600 hover:text-white cursor-pointer whitespace-nowrap"
              >
                {pill}
              </button>
            ))}
          </div>

          <div className="flex items-end gap-2 bg-[#0a0d18] border border-[#1f2942]/50 rounded-xl p-2">
            <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-[#12162b] transition-all duration-200">
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
              className="flex-1 max-h-24 bg-transparent py-2 px-2 text-sm text-white placeholder-gray-500 outline-none resize-none scrollbar-none leading-relaxed"
            />

            <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-[#12162b] transition-all duration-200">
              <span className="text-base">😊</span>
            </button>

            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200 cursor-pointer ${
                inputText.trim() ? "bg-indigo-600 text-white hover:bg-indigo-500" : "bg-[#12162b] text-gray-500 cursor-not-allowed"
              }`}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
