import { useNavigate } from "react-router-dom"
import { ArrowLeft, MessageSquare } from "lucide-react"

export default function ChatPlaceholder() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#080a12] p-4 text-center">
      <div className="rounded-2xl border border-[#1f2942] bg-[#0c0f1d] p-8 max-w-md w-full shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10 mb-4">
          <MessageSquare className="h-8 w-8 text-purple-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Tournament Chat</h1>
        <p className="text-sm text-gray-400 mb-6">
          This page is under development. Clicking this section navigated to <code className="text-purple-400">/chat</code>.
        </p>
        <button
          onClick={() => navigate("/")}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 py-2.5 text-sm font-semibold text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tournament
        </button>
      </div>
    </div>
  )
}
