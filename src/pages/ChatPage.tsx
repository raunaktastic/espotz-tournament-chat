import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Megaphone,
  Swords,
  Trophy,
  MoreVertical,
  Paperclip,
  Send,
  Users,
  X
} from "lucide-react"
import { mockChats } from "../data/mockChatData"
import type { ChatChannel, Message } from "../types/chat"

export default function ChatPage() {
  const navigate = useNavigate()
  const [channels, setChannels] = useState<ChatChannel[]>(mockChats)
  const [activeChannelId, setActiveChannelId] = useState<string>("tournament")
  const [inputText, setInputText] = useState<string>("")
  const [isPeoplePanelOpen, setIsPeoplePanelOpen] = useState<boolean>(false)
  const [activeMenu, setActiveMenu] = useState<boolean>(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get active channel details
  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0]

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activeChannelId, activeChannel.messages])

  // Handle send message
  const handleSendMessage = () => {
    if (!inputText.trim()) return

    const newMessage: Message = {
      id: `user_${Date.now()}`,
      senderId: "me",
      senderName: "Raunak",
      senderAvatarUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=gaming",
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
          };
        }
        return c
      })
    )
    setInputText("")
  }

  // Handle quick reply pills
  const handleQuickReply = (pill: string) => {
    setInputText((prev) => (prev ? prev + " " + pill : pill))
  }

  // Get matching icon for active channel
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

  return (
    <div className="flex h-screen flex-col bg-[#080a12] text-white overflow-hidden">
      {/* Top Chat Header */}
      <header className="flex h-16 items-center justify-between border-b border-[#1f2538] bg-[#0c0f1d] px-4 md:px-6 z-10">
        <div className="flex items-center gap-3">
          {/* Back button */}
          <button
            onClick={() => navigate("/")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1f2942] bg-[#0c0f1d] hover:bg-[#141829] text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>

          {/* Icon indicator */}
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#141829] border border-[#1f2942]">
            {renderChannelIcon(activeChannel.iconType)}
          </div>

          {/* Tournament title and info */}
          <div className="text-left">
            <h1 className="text-sm font-bold text-white flex items-center gap-1.5 leading-tight">
              girlie <span className="text-[10px] text-gray-500 font-normal">| {activeChannel.name}</span>
            </h1>
            <p className="text-xs text-gray-400 max-w-[200px] sm:max-w-xs md:max-w-md truncate">
              {activeChannel.subtitle}
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          {/* People Panel Toggle (Mobile/Tablet) */}
          <button
            onClick={() => setIsPeoplePanelOpen(!isPeoplePanelOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1f2942] bg-[#0c0f1d] hover:bg-[#141829] text-gray-400 hover:text-white lg:hidden transition-all cursor-pointer"
          >
            <Users className="h-4.5 w-4.5" />
          </button>

          {/* Three-dot menu */}
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
                    setActiveMenu(false);
                    alert("Chat notification settings updated!");
                  }}
                  className="w-full px-4 py-2 text-left text-xs hover:bg-[#141829] transition-colors"
                >
                  Mute Notifications
                </button>
                <button
                  onClick={() => {
                    setActiveMenu(false);
                    alert("Chat logs cleared locally.");
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

      {/* Main Panel */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Chat Area (Left/Center) */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Switcher Tabs Bar */}
          <div className="border-b border-[#1f2538] bg-[#090b14]/50 px-4 py-2.5">
            <div className="flex space-x-1.5 overflow-x-auto scrollbar-none rounded-lg bg-[#0c0f1d] p-1 border border-[#1f2942]/60 w-fit">
              {channels.map((chan) => {
                const isActive = chan.id === activeChannelId
                return (
                  <button
                    key={chan.id}
                    onClick={() => setActiveChannelId(chan.id)}
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#1f2942] text-white shadow-sm"
                        : "text-gray-400 hover:text-white hover:bg-[#141829]/50"
                    }`}
                  >
                    {renderChannelIcon(chan.iconType, "h-3.5 w-3.5")}
                    <span>{chan.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Messages Panel */}
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
                  {/* Left Avatar for other users */}
                  {!isOwn && (
                    <div className="h-8.5 w-8.5 overflow-hidden rounded-full ring-2 ring-indigo-500/30 shrink-0">
                      <img
                        src={msg.senderAvatarUrl}
                        alt={msg.senderName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  {/* Message bubble wrapper */}
                  <div className={`max-w-[70%] flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                    {/* Sender name for others */}
                    {!isOwn && (
                      <span className="text-[10px] font-bold text-gray-400 mb-1 ml-1">
                        {msg.senderName}
                      </span>
                    )}

                    {/* Chat Bubble content */}
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

                    {/* Timestamp */}
                    <span className="text-[9px] text-gray-500 mt-1 ml-1 mr-1">
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Right Avatar for current user */}
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

          {/* Input & Quick Reply Controls */}
          <div className="border-t border-[#1f2538] bg-[#0c0f1d] p-3 md:p-4">
            {/* Quick replies pills */}
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

            {/* Input fields */}
            <div className="flex items-end gap-2.5 bg-[#090b14] border border-[#1f2942] rounded-xl p-2 focus-within:border-indigo-500 transition-all">
              {/* Attach */}
              <button className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-[#12162b] transition-all cursor-pointer">
                <Paperclip className="h-4.5 w-4.5" />
              </button>

              {/* Text Area */}
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type a message..."
                rows={1}
                className="flex-1 max-h-20 bg-transparent py-1 px-1 text-sm text-white placeholder-gray-500 outline-none resize-none align-bottom scrollbar-none"
              />

              {/* Send */}
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
        </div>

        {/* People Panel Sidebar (Desktop) */}
        <div className="hidden lg:flex w-72 flex-col border-l border-[#1f2538] bg-[#0c0f1d] text-left">
          <div className="p-4 border-b border-[#1f2538] flex items-center justify-between">
            <span className="text-sm font-bold text-white tracking-wide">Participants</span>
            <span className="rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-xs font-bold text-indigo-400">
              {activeChannel.participants.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {activeChannel.participants.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-[#12162b]/50 transition-colors"
              >
                <div className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-gray-700/30">
                  <img src={member.avatarUrl} alt={member.name} className="h-full w-full object-cover" />
                  <span
                    className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-[#0c0f1d] ${
                      member.isOnline ? "bg-emerald-500" : "bg-gray-500"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-white truncate">{member.name}</span>
                    {member.isCurrentUser && (
                      <span className="rounded bg-indigo-600/20 px-1.5 py-0.5 text-[9px] font-bold text-indigo-400 uppercase tracking-wide">
                        Me
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500">
                    {member.isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Drawer slide-out for Mobile/Tablet */}
        {isPeoplePanelOpen && (
          <div className="lg:hidden absolute inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all flex justify-end">
            <div className="w-72 bg-[#0c0f1d] h-full flex flex-col border-l border-[#1f2538] text-left animate-slide-in">
              <div className="p-4 border-b border-[#1f2538] flex items-center justify-between">
                <span className="text-sm font-bold text-white tracking-wide">Participants</span>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-xs font-bold text-indigo-400">
                    {activeChannel.participants.length}
                  </span>
                  <button
                    onClick={() => setIsPeoplePanelOpen(false)}
                    className="p-1 hover:bg-[#12162b] rounded-lg text-gray-400 hover:text-white transition-all cursor-pointer"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {activeChannel.participants.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-[#12162b]/50 transition-colors"
                  >
                    <div className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-gray-700/30">
                      <img src={member.avatarUrl} alt={member.name} className="h-full w-full object-cover" />
                      <span
                        className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-[#0c0f1d] ${
                          member.isOnline ? "bg-emerald-500" : "bg-gray-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-white truncate">{member.name}</span>
                        {member.isCurrentUser && (
                          <span className="rounded bg-indigo-600/20 px-1.5 py-0.5 text-[9px] font-bold text-indigo-400 uppercase tracking-wide">
                            Me
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-500">
                        {member.isOnline ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
