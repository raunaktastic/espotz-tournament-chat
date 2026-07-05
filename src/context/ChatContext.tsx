import { useState, useRef, useEffect, createContext, useContext } from "react"
import type { ReactNode } from "react"
import { currentUser } from "../data/tournamentPlayers"
import { mockChats } from "../data/mockChatData"
import type { ChatChannel, Message } from "../types/chat"

interface ChatContextType {
  channels: ChatChannel[]
  activeChannelId: string
  setActiveChannelId: (id: string) => void
  inputText: string
  setInputText: (text: string) => void
  handleSendMessage: () => void
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  handleTextareaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleQuickReply: (pill: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [channels, setChannels] = useState<ChatChannel[]>(mockChats)
  const [activeChannelId, setActiveChannelId] = useState<string>("tournament")
  const [inputText, setInputText] = useState<string>("")

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activeChannelId, activeChannel.messages])

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

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }

  const handleQuickReply = (pill: string) => {
    setInputText((prev) => (prev ? prev + " " + pill : pill))
    textareaRef.current?.focus()
  }

  return (
    <ChatContext.Provider
      value={{
        channels,
        activeChannelId,
        setActiveChannelId,
        inputText,
        setInputText,
        handleSendMessage,
        messagesEndRef,
        textareaRef,
        handleTextareaChange,
        handleQuickReply,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
