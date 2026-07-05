import { useEffect, useState } from "react"

/** True at Tailwind `md` and up (768px). */
export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 768px)").matches
      : true
  )

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)")
    const onChange = () => setIsDesktop(media.matches)
    onChange()
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  return isDesktop
}
