import { motion } from "framer-motion"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const GameStatus = ({ 
  currentPlayer, 
  winner, 
  isDraw, 
  gameMode, 
  isMultiplayer = false,
  playerRole = null,
  isMyTurn = true,
  opponentConnected = true 
}) => {
  const getStatusMessage = () => {
    if (winner) {
      const isMyWin = isMultiplayer ? winner === playerRole : true
      const winnerText = isMultiplayer 
        ? (winner === playerRole ? "You Win!" : "Opponent Wins!")
        : `${winner} Wins!`
      
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
            {winnerText}
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

    if (isMultiplayer && !opponentConnected) {
      return (
        <motion.div 
          className="flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-3 h-3 rounded-full bg-warning"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-2xl font-display text-warning">
            Waiting for opponent...
          </span>
          <ApperIcon name="Users" className="text-warning/60" size={20} />
        </motion.div>
      )
    }

    if (isMultiplayer) {
      const isCurrentPlayerMe = currentPlayer === playerRole
      const turnText = isCurrentPlayerMe ? "Your Turn" : "Opponent's Turn"
      const turnColor = isCurrentPlayerMe 
        ? (playerRole === "X" ? "text-primary" : "text-secondary")
        : "text-gray-400"
      
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
            turnColor
          )}>
            {turnText} ({currentPlayer})
          </span>
          {isCurrentPlayerMe && (
            <ApperIcon name="User" className={cn(
              playerRole === "X" ? "text-primary/60" : "text-secondary/60"
            )} size={20} />
          )}
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