import type { ChatBreadcrumbSegment } from "../types/chat"

interface ChatBreadcrumbProps {
  segments: ChatBreadcrumbSegment[]
}

export default function ChatBreadcrumb({ segments }: ChatBreadcrumbProps) {
  if (segments.length === 0) return null

  return (
    <nav
      aria-label="Chat location breadcrumb"
      className="mt-1 flex flex-wrap items-center gap-1 text-[11px] text-gray-500"
    >
      <ol className="flex items-center gap-1">
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1

          return (
            <li key={`${segment.label}-${index}`} className="flex items-center gap-1">
              {index > 0 && (
                <span className="text-gray-600" aria-hidden="true">›</span>
              )}
              <span
                className={
                  isLast
                    ? "font-semibold text-indigo-300"
                    : "text-gray-500"
                }
                aria-current={isLast ? "page" : undefined}
              >
                {segment.label}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
