import { useState } from "react"
import { Trophy, Clock, Search, Users, HelpCircle } from "lucide-react"

export default function MatchesTabContent() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="rounded-xl border border-[#1f2942] bg-[#0c0f1d] p-6 text-left">
      {/* Tab Content Title */}
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="h-6 w-6 text-yellow-500" />
        <h2 className="text-xl font-bold text-white tracking-wide">Tournament Matches</h2>
      </div>

      {/* stage button */}
      <div className="mb-4">
        <span className="inline-block px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg shadow-md shadow-indigo-600/20">
          rocked
        </span>
      </div>

      {/* Stage Details Panel */}
      <div className="mb-6 rounded-lg border border-[#1f2942]/60 bg-[#12162b] p-4 text-sm text-gray-300">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-gray-400">Stage Type: </span>
            <span className="font-semibold text-white">FFA</span>
          </div>
          <div className="text-right">
            <span className="text-gray-400">Max Teams: </span>
            <span className="font-semibold text-white">4</span>
          </div>
        </div>
        <div>
          <span className="text-gray-400">Teams: </span>
          <span className="font-semibold text-white">0</span>
        </div>
      </div>

      {/* round button */}
      <div className="mb-4">
        <span className="inline-block px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg shadow-md shadow-indigo-600/20">
          Round 1
        </span>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by match no. or name..."
          className="w-full rounded-lg border border-[#1f2942] bg-[#0c0f1d] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* Match Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#1f2942] bg-[#12162b]/80 p-4 transition-all hover:border-indigo-500/40 hover:bg-[#12162b]">
          {/* Match header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-bold text-white">FFA Match 1</span>
              <Trophy className="h-3.5 w-3.5 text-yellow-500" />
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
            <Clock className="h-3.5 w-3.5" />
            <span>29 Jun 2026, 15:15</span>
          </div>

          {/* Teams count */}
          <div className="text-xs font-semibold text-gray-400 mb-2">
            FFA Teams (0/4)
          </div>

          {/* Empty teams list */}
          <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-[#1f2942] bg-[#090b14] py-4 text-xs text-gray-500">
            <HelpCircle className="h-4 w-4" />
            <span>No teams assigned</span>
          </div>
        </div>
      </div>
    </div>
  )
}
