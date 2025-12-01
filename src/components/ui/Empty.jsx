import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No Data Available", 
  description = "There's nothing here yet.", 
  action = null,
  icon = "Grid3X3",
  className,
  ...props 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center space-y-6", className)} {...props}>
      <div className="relative">
        <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center border-2 border-primary/20">
          <ApperIcon name={icon} size={40} className="text-primary/60" />
        </div>
        <div className="absolute inset-0 w-24 h-24 border-2 border-primary/20 rounded-full animate-pulse"></div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-2xl font-display text-white neon-text">{title}</h3>
        <p className="text-white/60 font-sans max-w-md mx-auto">{description}</p>
      </div>

      {action && (
        <div className="pt-4">
          {action}
        </div>
      )}
    </div>
  )
}

export default Empty