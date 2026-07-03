import { useNavigate } from "react-router-dom"
import { Trophy, Coins, Clock, Users } from "lucide-react"

export default function TournamentHeader() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 text-left">
      {/* Top Badges */}
      <div className="flex flex-wrap gap-2.5 mb-5">
        <span className="rounded-full bg-[#1b1f38] px-4 py-1 text-xs font-semibold text-gray-300">
          Completed
        </span>
        <span className="rounded-full bg-[#1b1f38] px-4 py-1 text-xs font-semibold text-gray-300">
          Call of Duty Mobile
        </span>
        <span className="flex items-center gap-1 rounded-full bg-[#1b1f38] px-4 py-1 text-xs font-semibold text-gray-300">
          <svg
            className="h-3.5 w-3.5 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
          Mobile
        </span>
      </div>

      {/* Main Title & Subtitle */}
      <div className="mb-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl mb-2">
          DemonlLord
        </h1>
        <p className="text-sm font-medium text-gray-400">
          fffffffffffffffffffff
        </p>
      </div>

      {/* Organizer Row */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/30 bg-[#0c1a16] font-bold text-xs text-emerald-400 tracking-wide">
          BGMI
        </div>
        <div>
          <div className="text-sm font-bold text-white leading-tight">NOVA Gaming</div>
          <div className="text-xs text-gray-400">Tournament Organizer</div>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1: Prize Pool */}
        <div className="rounded-xl border border-emerald-500/20 bg-[#0b1d1a]/40 p-4 transition-all hover:border-emerald-500/40">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Trophy className="h-4.5 w-4.5 text-emerald-500" />
            <span className="text-xs font-semibold tracking-wide">Prize Pool</span>
          </div>
          <div className="text-lg font-bold text-gray-300">
            No Prize Pool Available
          </div>
        </div>

        {/* Card 2: Entry Fee */}
        <div className="rounded-xl border border-blue-500/20 bg-[#09162e]/40 p-4 transition-all hover:border-blue-500/40">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Coins className="h-4.5 w-4.5 text-blue-400" />
            <span className="text-xs font-semibold tracking-wide">Entry Fee</span>
          </div>
          <div className="text-2xl font-black text-blue-400">
            Free
          </div>
        </div>

        {/* Card 3: Registration Progress */}
        <div className="rounded-xl border border-amber-500/20 bg-[#241a12]/40 p-4 transition-all hover:border-amber-500/40">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Clock className="h-4.5 w-4.5 text-amber-500" />
            <span className="text-xs font-semibold tracking-wide">Registration Progress</span>
          </div>
          <div className="text-xl font-bold text-amber-500">
            Registration Closed
          </div>
        </div>

        {/* Card 4: Players */}
        <div className="rounded-xl border border-purple-500/20 bg-[#1e1330]/40 p-4 transition-all hover:border-purple-500/40">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Users className="h-4.5 w-4.5 text-purple-400" />
            <span className="text-xs font-semibold tracking-wide">players</span>
          </div>
          <div className="text-2xl font-black text-purple-400">
            0/4
          </div>
        </div>
      </div>

      {/* Registration Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center text-xs font-semibold text-gray-400 mb-2">
          <span>Registration Progress</span>
          <span>0/4</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#181d30]">
          <div className="h-full w-0 bg-indigo-600 rounded-full" />
        </div>
      </div>

      {/* Tournament Ended Button */}
      <div className="mb-6">
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#273278] hover:bg-[#202964] py-3 text-sm font-semibold text-gray-300 transition-colors shadow-lg cursor-not-allowed">
          <Trophy className="h-4 w-4 text-gray-400" />
          Tournament Ended
        </button>
      </div>

      {/* Tournament Chat Section (IMPORTANT USER REQUIREMENT) */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/chat")}
          className="group relative flex w-full flex-col justify-center rounded-xl border border-purple-500/40 bg-gradient-to-r from-[#20133a] via-[#150d28] to-[#120822] p-5 text-left transition-all hover:scale-[1.01] hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xl">💬</span>
            <span className="text-base font-bold text-white tracking-wide group-hover:text-purple-300 transition-colors">
              Tournament Chat
            </span>
            <span className="ml-auto rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-bold text-purple-300 uppercase tracking-widest group-hover:bg-purple-500/30 transition-all">
              Live
            </span>
          </div>
          <p className="mt-1 pl-7 text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
            Chat with registered players
          </p>
        </button>
      </div>
    </div>
  )
}
