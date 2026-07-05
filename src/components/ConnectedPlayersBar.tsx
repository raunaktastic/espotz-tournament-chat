import { useMemo, useState } from "react"
import { Crown, Users, X, Search } from "lucide-react"
import type { Participant } from "../types/chat"

interface ConnectedPlayersBarProps {
  participants: Participant[]
  isLobby?: boolean
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
}

function playerInitial(player: Participant): string {
  const label = player.registeredName || player.name
  return label.charAt(0).toUpperCase()
}

function PlayerCard({ player }: { player: Participant }) {
  const isLeader = Boolean(player.isLeader)
  const registeredName = player.registeredName || player.name
  const username = player.username || player.name.toLowerCase().replace(/\s+/g, "")
  const gameId = player.gameId || "ΓÇö"

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-3 py-3 ${
        isLeader
          ? "border-amber-400/60 bg-[#141829]"
          : "border-white/5 bg-[#141829]/90"
      }`}
    >
      <div className="relative shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-lg font-bold text-white shadow-lg shadow-purple-900/40">
          {playerInitial(player)}
        </div>
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-[#0c0f1d] ${
            player.isOnline ? "bg-emerald-500" : "bg-red-500"
          }`}
        />
      </div>

      <div className="min-w-0 flex-1 leading-snug">
        <div className="flex items-center gap-1.5">
          <span
            className={`truncate text-[15px] font-bold tracking-tight ${
              isLeader ? "text-amber-300" : "text-white"
            }`}
          >
            {registeredName}
          </span>
          {isLeader && (
            <Crown className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
          )}
          {player.isCurrentUser && (
            <span className="shrink-0 rounded bg-purple-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-purple-300">
              You
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-[13px] text-slate-400">@{username}</p>
        <p className="mt-0.5 truncate text-xs text-slate-500">ID: {gameId}</p>
      </div>
    </div>
  )
}

export default function ConnectedPlayersBar({
  participants,
  isLobby = false,
  onExpandedChange,
}: ConnectedPlayersBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const onlineCount = participants.filter((p) => p.isOnline).length

  const sortedParticipants = useMemo(() => {
    return [...participants].sort((a, b) => {
      if (a.isLeader !== b.isLeader) return a.isLeader ? -1 : 1
      return Number(b.isOnline) - Number(a.isOnline)
    })
  }, [participants])

  const filteredParticipants = useMemo(() => {
    if (!searchQuery.trim()) return sortedParticipants
    const query = searchQuery.toLowerCase()
    return sortedParticipants.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.registeredName?.toLowerCase().includes(query)) ||
        (p.username?.toLowerCase().includes(query))
    )
  }, [sortedParticipants, searchQuery])

  return (
    <>
      {/* Dim messages behind the panel */}
      <button
        type="button"
        className="absolute inset-0 z-20 bg-black/50 backdrop-blur-[2px] cursor-default"
        aria-label="Close players list"
        onClick={() => onExpandedChange?.(false)}
      />

      {/* Right-side sliding panel */}
      <div className="absolute inset-y-0 right-0 z-30 flex w-full max-w-[340px] flex-col border-l border-purple-500/30 bg-[#0a0d18] shadow-2xl shadow-black/60 animate-slide-in-right md:max-w-[340px] sm:max-w-[300px]">
        <div className="flex shrink-0 flex-col border-b border-purple-500/20 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600/20 text-purple-300">
                <Users className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white">
                  {isLobby ? "Players" : "Match players"}
                </p>
                <p className="text-[11px] text-gray-500">
                  <span className="text-emerald-400">{onlineCount}</span> online
                  <span className="text-gray-600"> · </span>
                  {participants.length} total
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onExpandedChange?.(false)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition-colors hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-white cursor-pointer"
              aria-label="Close players list"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Search input */}
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search players..."
              className="w-full rounded-lg border border-purple-500/25 bg-[#12162b] py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/20 transition-all"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain px-3 py-3">
          {filteredParticipants.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-4">No players found</p>
          ) : (
            filteredParticipants.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))
          )}
        </div>
      </div>
    </>
  )
}
