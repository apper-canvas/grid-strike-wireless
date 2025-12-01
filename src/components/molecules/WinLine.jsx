import { motion } from "framer-motion"
import { cn } from "@/utils/cn"

const WinLine = ({ winningLine }) => {
  if (!winningLine) return null

  const getLineStyle = () => {
    const { type, row, col, diagonal } = winningLine

    switch (type) {
      case "horizontal":
        return {
          className: cn("win-line win-line-horizontal"),
          style: { top: `${16.67 + (row * 33.33)}%` }
        }
      case "vertical":
        return {
          className: cn("win-line win-line-vertical"),
          style: { left: `${16.67 + (col * 33.33)}%` }
        }
      case "diagonal":
        return {
          className: cn(
            "win-line win-line-diagonal",
            diagonal === 1 ? "win-line-diagonal-1" : "win-line-diagonal-2"
          ),
          style: {}
        }
      default:
        return { className: "", style: {} }
    }
  }

  const { className, style } = getLineStyle()

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    />
  )
}

export default WinLine