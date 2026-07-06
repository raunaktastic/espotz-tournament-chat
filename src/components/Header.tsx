import { Bell, Wallet, Globe } from "lucide-react"

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#1f2538] bg-[#090b14] px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-wider text-white">
            espotz
          </span>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-white transition-colors">
            Academy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Clan
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Org
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Play
          </a>
          <a href="#" className="text-yellow-500 hover:text-yellow-400 transition-colors">
            Zoop
          </a>
        </nav>

        {/* Right: Actions and Profile */}
        <div className="flex items-center gap-5">
          <button className="relative p-1 text-gray-400 hover:text-white transition-all">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#090b14]" />
          </button>

          <button className="p-1 text-gray-400 hover:text-white transition-all">
            <Wallet className="h-5 w-5" />
          </button>

          <button className="p-1 text-gray-400 hover:text-white transition-all">
            <Globe className="h-5 w-5" />
          </button>

          <div className="h-8 w-8 overflow-hidden rounded-full ring-2 ring-purple-500/50 hover:ring-purple-400 transition-all cursor-pointer">
            <img
              src="https://api.dicebear.com/7.x/pixel-art/svg?seed=gaming"
              alt="User Avatar"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
