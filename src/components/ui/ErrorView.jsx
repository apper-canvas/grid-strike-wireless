import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const ErrorView = ({ message = "Something went wrong", onRetry, className, ...props }) => {
  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-background", className)} {...props}>
      <div className="text-center space-y-6 p-8">
        <div className="relative">
          <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center border-2 border-error/20">
            <ApperIcon name="AlertTriangle" size={40} className="text-error animate-pulse" />
          </div>
          <div className="absolute inset-0 w-24 h-24 border-2 border-error rounded-full animate-ping opacity-20"></div>
        </div>
        
        <div className="space-y-3">
          <h2 className="text-3xl font-display text-white neon-text">Game Error</h2>
          <p className="text-error text-lg font-medium max-w-md mx-auto">
            {message}
          </p>
          <p className="text-white/60 font-sans max-w-md mx-auto">
            Don't worry, we can get back to the game quickly.
          </p>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-lg font-semibold hover:shadow-neon-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <div className="flex items-center gap-2">
              <ApperIcon name="RotateCcw" size={20} />
              Try Again
            </div>
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorView