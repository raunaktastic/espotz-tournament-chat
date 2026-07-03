export default function SkeletonLoader({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded ${className}`} />
}
