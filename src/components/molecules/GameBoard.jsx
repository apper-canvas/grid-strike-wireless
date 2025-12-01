import { motion } from "framer-motion"
import GameCell from "@/components/molecules/GameCell"
import WinLine from "@/components/molecules/WinLine"

const GameBoard = ({ board, onCellClick, disabled = false, winningLine = null }) => {
  const isWinningCell = (index) => {
    return winningLine && winningLine.pattern.includes(index)
  }

  return (
    <div className="relative">
      <motion.div 
        className="grid grid-cols-3 gap-3 w-80 h-80 mx-auto p-4 bg-surface/30 rounded-2xl border border-primary/10 backdrop-blur-sm"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {board.map((cell, index) => (
          <GameCell
            key={index}
            value={cell}
            onClick={onCellClick}
            disabled={disabled}
            isWinning={isWinningCell(index)}
            position={index}
          />
        ))}
      </motion.div>
      
      {winningLine && <WinLine winningLine={winningLine} />}
    </div>
  )
}

export default GameBoard