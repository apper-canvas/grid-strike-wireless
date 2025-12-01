import { motion } from "framer-motion"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const GameStatus = ({ currentPlayer, winner, isDraw, gameMode }) => {
  const getStatusMessage = () => {
    if (winner) {
      return (
        <motion.div 
          className="flex items-center justify-center gap-3"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ApperIcon name="Trophy" className="text-success animate-pulse" size={28} />
          <span className={cn(
            "text-3xl font-display",
            winner === "X" && "text-primary neon-text",
            winner === "O" && "text-secondary",
            "animate-pulse-glow"
          )}>
            {winner} Wins!
          </span>
          <ApperIcon name="Trophy" className="text-success animate-pulse" size={28} />
        </motion.div>
      )
    }

    if (isDraw) {
      return (
        <motion.div 
          className="flex items-center justify-center gap-3"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ApperIcon name="Equal" className="text-warning" size={24} />
          <span className="text-2xl font-display text-warning">
            It's a Draw!
          </span>
          <ApperIcon name="Equal" className="text-warning" size={24} />
        </motion.div>
      )
    }

    return (
      <motion.div 
        className="flex items-center justify-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={currentPlayer}
      >
        <motion.div
          className={cn(
            "w-3 h-3 rounded-full",
            currentPlayer === "X" && "bg-primary shadow-neon",
            currentPlayer === "O" && "bg-secondary shadow-[0_0_20px_rgba(236,72,153,0.3)]"
          )}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <span className={cn(
          "text-2xl font-display",
          currentPlayer === "X" && "text-primary",
          currentPlayer === "O" && "text-secondary"
        )}>
          {currentPlayer === "X" ? "X" : "O"}'s Turn
        </span>
        {gameMode === "single" && currentPlayer === "O" && (
          <ApperIcon name="Bot" className="text-secondary/60" size={20} />
        )}
      </motion.div>
    )
  }

  return (
    <div className="text-center py-6">
      {getStatusMessage()}
    </div>
  )
}

export default GameStatus