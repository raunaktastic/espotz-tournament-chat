import { useState, useRef, useEffect, useMemo, useCallback } from "react"

import { useNavigate } from "react-router-dom"

import {

  ArrowLeft,

  MoreVertical,

  Send,

  X,

  SmilePlus,

  Users,

  Swords,

  Megaphone,

  Minimize2,

} from "lucide-react"

import { mockChats } from "../data/mockChatData"

import { currentUser } from "../data/tournamentPlayers"

import {

  mockTournamentChatTree,

  findChatPath,

} from "../data/chatNavigatorMock"

import Header from "../components/Header"

import { getChatHeaderParts } from "../lib/chatHeader"

import {

  loadRecentChatIds,

  persistRecentChatIds,

  touchRecent,

  MESSAGE_WINDOW_SIZE,

} from "../lib/recentChats"

import type { ChatChannel, Message } from "../types/chat"



const INITIAL_CHANNEL_ID = "tournament"

const QUICK_REPLIES = ["GG", "WP", "GLHF"]



export default function ChatPage() {

  const navigate = useNavigate()

  const [channels, setChannels] = useState<ChatChannel[]>(mockChats)

  const activeChannelId = INITIAL_CHANNEL_ID

  const [inputText, setInputText] = useState<string>("")

  const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState<boolean>(false)

  const [showQuickReplies, setShowQuickReplies] = useState<boolean>(false)

  const [activeMenu, setActiveMenu] = useState<boolean>(false)

  const [recentIds, setRecentIds] = useState<string[]>(() => loadRecentChatIds(mockChats))

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



  const visibleMessages = useMemo(

    () => activeChannel.messages.slice(-visibleCount),

    [activeChannel.messages, visibleCount]

  )

  const hasOlderMessages = activeChannel.messages.length > visibleCount



  const onlineCount = activeChannel.participants.filter((p) => p.isOnline).length



  const scrollToBottom = useCallback((instant = true) => {

    const container = messagesContainerRef.current

    if (!container) return

    const run = () => {

      container.scrollTop = container.scrollHeight

    }

    if (instant) {

      requestAnimationFrame(run)

    } else {

      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

    }

  }, [])



  useEffect(() => {

    setVisibleCount(MESSAGE_WINDOW_SIZE)

    scrollToBottom(true)

  }, [activeChannelId, scrollToBottom])



  useEffect(() => {

    persistRecentChatIds(recentIds)

  }, [recentIds])



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

    setShowQuickReplies(false)

    requestAnimationFrame(() => scrollToBottom(true))

  }



  const handleLoadEarlier = () => {

    const container = messagesContainerRef.current

    const prevHeight = container?.scrollHeight ?? 0

    setVisibleCount((c) => c + MESSAGE_WINDOW_SIZE)

    requestAnimationFrame(() => {

      requestAnimationFrame(() => {

        if (!container) return

        container.scrollTop = container.scrollHeight - prevHeight

      })

    })

  }



  const handleQuickReply = (pill: string) => {

    setInputText((prev) => (prev ? `${prev} ${pill}` : pill))

  }



  return (

    <div className="flex h-[100dvh] flex-col bg-[#080a12] text-white overflow-hidden">

      <Header />



      <div className="flex flex-1 min-h-0 flex-col overflow-hidden md:pt-20 md:px-6 md:pb-6">

        <div className="flex w-full flex-1 min-h-0 flex-col md:mx-auto md:max-w-7xl md:px-4">

          <div className="flex min-h-0 flex-1 overflow-hidden md:rounded-xl border border-purple-500/20 bg-[#0c0f1d]/70 backdrop-blur-md shadow-2xl shadow-black/50">

            {/* Chat column */}

            <div className="flex flex-1 flex-col overflow-hidden min-w-0">

              {/* Chat header: Back to Tournament | chat title */}

              <header className="flex shrink-0 flex-col border-b border-purple-500/20 bg-[#0a0d18] px-3 md:px-4">

                <div className="flex min-h-14 items-center justify-between gap-3 py-2">

                <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">

                  <button

                    type="button"

                    onClick={() => navigate("/")}

                    className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-2 text-sm font-semibold text-purple-200 transition-colors hover:border-purple-400/50 hover:bg-purple-600 hover:text-white cursor-pointer sm:px-3"

                    aria-label="Back to Tournament"

                  >

                    <ArrowLeft className="h-4 w-4 shrink-0" />

                    <span className="hidden sm:inline">Back to Tournament</span>

                  </button>

                  <h1 className="flex min-w-0 flex-1 items-center gap-2">

                    <span

                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${

                        chatTitleParts.isLobby

                          ? "bg-purple-600/25 text-purple-300"

                          : "bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/40"

                      }`}

                    >

                      {chatTitleParts.isLobby ? (

                        <Megaphone className="h-4 w-4" />

                      ) : (

                        <Swords className="h-4 w-4" />

                      )}

                    </span>

                    <span className="min-w-0 truncate">

                      <span className="block truncate text-base font-extrabold tracking-tight text-white sm:text-lg">

                        {chatTitleParts.primary}

                      </span>

                      {chatTitleParts.secondary && (

                        <span className="mt-0.5 inline-flex max-w-full items-center truncate rounded-md border border-purple-500/30 bg-purple-500/15 px-1.5 py-px text-[10px] font-bold uppercase tracking-wider text-purple-200">

                          {chatTitleParts.secondary}

                        </span>

                      )}

                    </span>

                  </h1>

                </div>



                <div className="flex shrink-0 items-center gap-1">

                  {/* Mobile: Close button */}
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="md:hidden flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-purple-500/10 hover:text-white cursor-pointer"
                    aria-label="Close chat"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  {/* Desktop: minimize to Messenger popup on tournament page */}

                  <button

                    type="button"

                    onClick={() => {

                      navigate("/", {

                        state: {

                          openChatPopup: true,

                          activeChannelId,

                        },

                      })

                    }}

                    className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-purple-500/10 hover:text-white cursor-pointer"

                    aria-label="Minimize to chat popup"

                    title="Minimize"

                  >

                    <Minimize2 className="h-4 w-4" />

                  </button>



                  <button

                    type="button"

                    onClick={() => {

                      setIsSidebarDrawerOpen(true)

                    }}

                    className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-medium transition-colors cursor-pointer text-gray-400 hover:bg-[#141829] hover:text-white"

                    aria-label="Show players list"

                  >

                    <Users className="h-4 w-4" />

                    <span className="text-emerald-400">{onlineCount}</span>

                  </button>



                  <div className="relative">

                    <button

                      type="button"

                      onClick={() => setActiveMenu(!activeMenu)}

                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-[#141829] hover:text-white cursor-pointer"

                      aria-label="Chat options"

                    >

                      <MoreVertical className="h-4 w-4" />

                    </button>

                    {activeMenu && (

                      <div className="absolute right-0 mt-1 w-44 rounded-lg border border-purple-500/20 bg-[#0c0f1d] py-1 shadow-2xl z-50">

                        <button

                          type="button"

                          onClick={() => {

                            setActiveMenu(false)

                            alert("Notifications muted for this chat.")

                          }}

                          className="w-full px-3 py-2 text-left text-xs hover:bg-[#141829] transition-colors"

                        >

                          Mute notifications

                        </button>

                        <button

                          type="button"

                          onClick={() => {

                            setActiveMenu(false)

                            alert("Chat cleared locally.")

                          }}

                          className="w-full px-3 py-2 text-left text-xs text-red-400 hover:bg-[#141829] transition-colors"

                        >

                          Clear chat

                        </button>

                      </div>

                    )}

                  </div>

                </div>

                </div>

                <div className="h-0.5 w-full rounded-full bg-gradient-to-r from-purple-500 to-transparent" />

              </header>



              <div className="relative flex flex-1 flex-col overflow-hidden min-h-0">

                {/* Messages ΓÇö recent window (last N), scroll to latest on open */}

                <div

                  ref={messagesContainerRef}

                  className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-[#0c0f1d]/20 to-transparent"

                >

                  {activeChannel.messages.length === 0 ? (

                    <div className="flex h-full items-center justify-center">

                      <p className="text-sm text-gray-500">No messages yet. Say GLHF!</p>

                    </div>

                  ) : (

                    <>

                      {hasOlderMessages && (

                        <div className="flex justify-center pb-1">

                          <button

                            type="button"

                            onClick={handleLoadEarlier}

                            className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-[11px] font-semibold text-purple-200 transition-colors hover:border-purple-400/50 hover:bg-purple-600/20 cursor-pointer"

                          >

                            Load earlier messages

                          </button>

                        </div>

                      )}

                      {visibleMessages.map((msg) => {

                        const isOwn = msg.senderId === "me"



                        if (msg.type === "system") {

                          return (

                            <div key={msg.id} className="flex justify-center my-2">

                              <span className="rounded-full border border-[#1f2942] bg-[#12162b]/60 px-3 py-1 text-[11px] text-gray-400">

                                {msg.content}

                              </span>

                            </div>

                          )

                        }



                        return (

                          <div

                            key={msg.id}

                            className={`flex items-end gap-2 ${isOwn ? "justify-end" : "justify-start"}`}

                          >

                            {!isOwn && (

                              <img

                                src={msg.senderAvatarUrl}

                                alt={msg.senderName}

                                className="h-7 w-7 shrink-0 rounded-full ring-1 ring-purple-500/30 object-cover"

                              />

                            )}

                            <div

                              className={`max-w-[75%] flex flex-col ${isOwn ? "items-end" : "items-start"}`}

                            >

                              {!isOwn && (

                                <span className="mb-0.5 ml-1 text-[10px] font-medium text-gray-500">

                                  {msg.senderName}

                                </span>

                              )}

                              <div

                                className={`rounded-2xl px-3.5 py-2 text-sm ${

                                  isOwn

                                    ? "bg-purple-600 text-white rounded-br-sm"

                                    : "border border-purple-500/25 bg-gray-900/70 text-gray-100 rounded-bl-sm"

                                }`}

                              >

                                {msg.type === "image" ? (

                                  <div className="space-y-1.5">

                                    <p>{msg.content}</p>

                                    <img

                                      src={msg.imageUrl}

                                      alt="Attachment"

                                      className="max-h-40 rounded-lg object-cover"

                                    />

                                  </div>

                                ) : (

                                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                                )}

                              </div>

                              <span className="mt-0.5 text-[9px] text-gray-600">{msg.timestamp}</span>

                            </div>

                          </div>

                        )

                      })}

                    </>

                  )}

                  <div ref={messagesEndRef} />

                </div>



                {/* Input */}

                <div className="shrink-0 border-t border-purple-500/20 bg-[#0c0f1d]/50 p-3">

                  {showQuickReplies && (

                    <div className="mb-2 flex gap-1.5">

                      {QUICK_REPLIES.map((pill) => (

                        <button

                          key={pill}

                          type="button"

                          onClick={() => handleQuickReply(pill)}

                          className="rounded-full border border-purple-500/25 bg-[#12162b] px-3 py-0.5 text-xs font-semibold text-gray-300 transition-colors hover:border-purple-400 hover:text-purple-200 cursor-pointer"

                        >

                          {pill}

                        </button>

                      ))}

                    </div>

                  )}



                  <div className="flex items-end gap-2 rounded-xl border border-purple-500/25 bg-gray-900/50 p-1.5 focus-within:border-purple-400/50 transition-colors">

                    <button

                      type="button"

                      onClick={() => setShowQuickReplies((v) => !v)}

                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors cursor-pointer ${

                        showQuickReplies

                          ? "bg-purple-600/20 text-purple-300"

                          : "text-gray-500 hover:text-gray-300"

                      }`}

                      aria-label="Quick replies"

                    >

                      <SmilePlus className="h-4 w-4" />

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

                      className="max-h-16 flex-1 resize-none bg-transparent py-1.5 text-sm text-white placeholder-gray-500 outline-none"

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

                      <Send className="h-4 w-4" />

                    </button>

                  </div>

                </div>

              </div>

            </div>



            {/* Online Players sidebar drawer */}

            {isSidebarDrawerOpen && (

              <div 

                className="absolute inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in"

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

        </div>

      </div>

    </div>

  )

}

