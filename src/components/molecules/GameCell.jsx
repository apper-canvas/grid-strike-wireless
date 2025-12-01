import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"

const GameCell = ({ value, onClick, disabled = false, isWinning = false, position }) => {
  const [isShaking, setIsShaking] = useState(false)

  const handleClick = () => {
    if (disabled || value) {
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 200)
      return
    }
    onClick(position)
  }

  return (
    <motion.div
      className={cn(
        "game-cell",
        value && "occupied",
        isShaking && "shake",
        isWinning && "animate-scale-pulse"
      )}
      onClick={handleClick}
      whileHover={{ scale: disabled || value ? 1 : 1.05 }}
      whileTap={{ scale: disabled || value ? 1 : 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {value && (
        <motion.div
          initial={{ scale: 0, rotate: 0, opacity: 0 }}
          animate={{ scale: 1, rotate: value === "X" ? 5 : -5, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.3
          }}
          className={cn(
            "select-none",
            value === "X" && "mark-x",
            value === "O" && "mark-o"
          )}
        >
          {value}
        </motion.div>
      )}
    </motion.div>
  )
}

export default GameCell