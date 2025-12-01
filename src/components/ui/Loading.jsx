import { cn } from "@/utils/cn"

const Loading = ({ className, ...props }) => {
  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-background", className)} {...props}>
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-surface rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-t-primary border-r-secondary border-transparent rounded-full animate-spin"></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-display text-white neon-text">Loading Game</h2>
          <p className="text-white/60 font-sans">Preparing your neon battlefield...</p>
        </div>
      </div>
    </div>
  )
}

export default Loading