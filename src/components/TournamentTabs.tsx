import { useState } from "react"
import MatchesTabContent from "./MatchesTabContent"

const TABS = [
  "Overview",
  "Matches",
  "Teams",
  "Announcements",
  "Final Standing",
  "Prizes",
  "Streams",
  "Rules",
  "Ratings",
  "Disputes",
]

export default function TournamentTabs() {
  const [activeTab, setActiveTab] = useState("Matches")

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12">
      {/* Tabs list (horizontal scrollable on mobile) */}
      <div className="flex border-b border-[#1f2538] pb-1 overflow-x-auto scrollbar-none mb-6">
        <div className="flex gap-2">
          {TABS.map((tab) => {
            const isActive = tab === activeTab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-black shadow-md"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab content panel */}
      <div>
        {activeTab === "Matches" ? (
          <MatchesTabContent />
        ) : (
          <div className="rounded-xl border border-[#1f2942] bg-[#0c0f1d] p-12 text-center">
            <h3 className="text-lg font-bold text-white mb-2">{activeTab} Section</h3>
            <p className="text-sm text-gray-400">
              Content for the <span className="text-indigo-400">{activeTab}</span> tab is under development.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
