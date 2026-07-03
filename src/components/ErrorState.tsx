import type { LucideIcon } from "lucide-react"

interface ErrorStateProps {
  icon?: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export default function ErrorState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      {Icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/30">
          <Icon className="h-8 w-8 text-red-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 max-w-sm mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-500 transition-all duration-200 shadow-md shadow-red-600/25 cursor-pointer"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
