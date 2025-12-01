import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import { Card, CardContent } from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const GameControls = ({ 
  gameMode, 
  onModeChange, 
  difficulty, 
  onDifficultyChange, 
  onNewGame, 
  onClearScore,
  isGameActive 
}) => {
  const modes = [
    { value: "two-player", label: "2 Players", icon: "Users" },
    { value: "single", label: "vs AI", icon: "Bot" }
  ]

  const difficulties = [
    { value: "easy", label: "Easy", color: "text-success" },
    { value: "medium", label: "Medium", color: "text-warning" },
    { value: "hard", label: "Hard", color: "text-error" }
  ]

  return (
    <Card className="w-full max-w-md">
      <CardContent className="space-y-6">
        {/* Game Mode */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2">
            <ApperIcon name="GamepadIcon" size={20} />
            Game Mode
          </h3>
          <div className="flex gap-2">
            {modes.map((mode) => (
              <Button
                key={mode.value}
                variant={gameMode === mode.value ? "primary" : "outline"}
                size="sm"
                onClick={() => onModeChange(mode.value)}
                className="flex-1 flex items-center gap-2"
                disabled={isGameActive}
              >
                <ApperIcon name={mode.icon} size={16} />
                {mode.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Difficulty (only for single player) */}
        {gameMode === "single" && (
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2">
              <ApperIcon name="Brain" size={20} />
              Difficulty
            </h3>
            <div className="flex gap-2">
              {difficulties.map((diff) => (
                <Button
                  key={diff.value}
                  variant={difficulty === diff.value ? "primary" : "outline"}
                  size="sm"
                  onClick={() => onDifficultyChange(diff.value)}
                  className={cn(
                    "flex-1",
                    difficulty === diff.value && diff.color
                  )}
                  disabled={isGameActive}
                >
                  {diff.label}
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Control Buttons */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <Button
            variant="success"
            onClick={onNewGame}
            className="w-full flex items-center gap-2"
          >
            <ApperIcon name="RotateCcw" size={20} />
            New Game
          </Button>
          
          <Button
            variant="ghost"
            onClick={onClearScore}
            size="sm"
            className="w-full flex items-center gap-2 text-white/60 hover:text-error"
          >
            <ApperIcon name="Trash2" size={16} />
            Clear Scores
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default GameControls