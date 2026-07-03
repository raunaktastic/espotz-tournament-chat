import type { Participant } from "../types/chat"

interface ConnectedPlayersBarProps {
  participants: Participant[]
  label?: string
}

function StatusDot({ isOnline }: { isOnline: boolean }) {
  return (
    <span
      className={`h-1.5 w-1.5 shrink-0 rounded-full ${isOnline ? "bg-emerald-500" : "bg-gray-500"}`}
      title={isOnline ? "Online" : "Offline"}
    />
  )
}

export default function ConnectedPlayersBar({
  participants,
  label = "Connected Players",
}: ConnectedPlayersBarProps) {
  const onlineCount = participants.filter((p) => p.isOnline).length

  return (
    <div className="border-b border-[#1f2538]/50 bg-[#0a0d18]/80 px-4 py-2">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
          {label}
        </span>
        <span className="text-[10px] font-medium text-gray-500">
          <span className="text-emerald-400">{onlineCount}</span> online ·{" "}
          <span className="text-gray-500">{participants.length - onlineCount}</span> offline
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {participants.map((player) => (
          <div
            key={player.id}
            className="flex shrink-0 items-center gap-2 rounded-full border border-[#1f2942]/40 bg-[#12162b] px-2.5 py-1 transition-all duration-200 hover:border-[#2a3555] hover:bg-[#1a1f35] cursor-pointer group"
            title={`${player.name} — ${player.isOnline ? "Online" : "Offline"}`}
          >
            <StatusDot isOnline={player.isOnline} />
            <span className="max-w-[90px] truncate text-xs font-medium text-gray-300 group-hover:text-white transition-colors">
              {player.name}
            </span>
            {player.isCurrentUser && (
              <span className="rounded bg-indigo-600/20 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-indigo-400">
                You
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
