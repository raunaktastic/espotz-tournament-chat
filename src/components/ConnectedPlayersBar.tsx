import type { Participant } from "../types/chat"

interface ConnectedPlayersBarProps {
  participants: Participant[]
  label?: string
}

function StatusDot({ isOnline }: { isOnline: boolean }) {
  return (
    <span
      className={`h-2 w-2 shrink-0 rounded-full ${isOnline ? "bg-emerald-500" : "bg-red-500"}`}
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
    <div className="border-b border-[#1f2538] bg-[#090b14]/50 px-4 py-2.5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
          {label}
        </span>
        <span className="text-[11px] font-semibold text-gray-500">
          <span className="text-emerald-400">{onlineCount}</span> online ·{" "}
          <span className="text-red-400">{participants.length - onlineCount}</span> offline
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
        {participants.map((player) => (
          <div
            key={player.id}
            className="flex shrink-0 items-center gap-2 rounded-full border border-[#1f2942]/70 bg-[#0c0f1d] px-3 py-1.5 transition-colors hover:border-[#1f2942] hover:bg-[#12162b]/60"
            title={`${player.name} — ${player.isOnline ? "Online" : "Offline"}`}
          >
            <StatusDot isOnline={player.isOnline} />
            <span className="max-w-[120px] truncate text-xs font-semibold text-gray-200">
              {player.name}
            </span>
            {player.isCurrentUser && (
              <span className="rounded bg-indigo-600/25 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-indigo-400">
                You
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
