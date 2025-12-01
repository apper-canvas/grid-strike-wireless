import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import { Card } from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"
import { toast } from "react-toastify"

const RoomControls = ({ 
  roomId,
  players,
  playerRole,
  onNewGame,
  onClearScore,
  isGameActive,
  opponentConnected 
}) => {
  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId)
      toast.success("📋 Room ID copied to clipboard!", {
        position: "top-right",
        autoClose: 2000
      })
    } catch (error) {
      toast.error("Failed to copy room ID", {
        position: "top-right",
        autoClose: 2000
      })
    }
  }

  const handleInvitePlayer = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my Grid Strike game!',
          text: `Join me for a game of Tic Tac Toe! Use room ID: ${roomId}`,
          url: window.location.origin + `/room/${roomId}`
        })
      } catch (error) {
        // Share was cancelled or failed, fall back to copy
        handleCopyRoomId()
      }
    } else {
      // Share API not available, copy to clipboard
      handleCopyRoomId()
    }
  }

  const getPlayerInfo = (symbol) => {
    const player = players.find(p => p.symbol === symbol)
    if (!player) return { name: "Waiting...", isYou: false }
    
    const isYou = player.symbol === playerRole
    return { 
      name: isYou ? "You" : player.name, 
      isYou,
      connected: true
    }
  }

  const playerX = getPlayerInfo("X")
  const playerO = getPlayerInfo("O")

  return (
    <div className="space-y-4">
      {/* Room Info */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Room Info</h3>
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                opponentConnected ? "bg-success" : "bg-warning"
              )} />
              <span className="text-sm text-gray-400">
                {opponentConnected ? "Connected" : "Waiting for opponent"}
              </span>
            </div>
          </div>
          
          <div className="bg-surface/50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Room ID</p>
                <p className="text-lg font-bold text-primary font-mono">{roomId}</p>
              </div>
              <Button
                onClick={handleCopyRoomId}
                className="bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/20 hover:border-secondary/40 transition-all duration-200 p-2"
              >
                <ApperIcon name="Copy" size={16} />
              </Button>
            </div>
          </div>

          {/* Players */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface/30 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-2xl text-primary font-bold">X</span>
                {playerX.isYou && <ApperIcon name="User" size={16} className="text-primary" />}
              </div>
              <p className={cn(
                "text-sm font-medium",
                playerX.isYou ? "text-primary" : "text-gray-300"
              )}>
                {playerX.name}
              </p>
              {playerX.connected && (
                <div className="flex items-center justify-center gap-1 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-success" />
                  <span className="text-xs text-success">Online</span>
                </div>
              )}
            </div>
            
            <div className="bg-surface/30 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-2xl text-secondary font-bold">O</span>
                {playerO.isYou && <ApperIcon name="User" size={16} className="text-secondary" />}
              </div>
              <p className={cn(
                "text-sm font-medium",
                playerO.isYou ? "text-secondary" : "text-gray-300"
              )}>
                {playerO.name}
              </p>
              {playerO.connected && (
                <div className="flex items-center justify-center gap-1 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-success" />
                  <span className="text-xs text-success">Online</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Game Controls */}
      <Card className="p-4">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Game Controls</h3>
          
          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={onNewGame}
              disabled={!opponentConnected}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3",
                "bg-success hover:bg-success/80 text-white font-medium",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all duration-200"
              )}
            >
              <ApperIcon name="RotateCcw" size={18} />
              New Game
            </Button>

            <Button
              onClick={onClearScore}
              disabled={isGameActive}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3",
                "bg-warning hover:bg-warning/80 text-white font-medium",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all duration-200"
              )}
            >
              <ApperIcon name="Trash2" size={18} />
              Clear Scores
            </Button>
          </div>
        </div>
      </Card>

      {/* Invite Controls */}
      {!opponentConnected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-4">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Invite Friend</h3>
              
              <Button
                onClick={handleInvitePlayer}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/80 text-white font-medium transition-all duration-200"
              >
                <ApperIcon name="Share" size={18} />
                Share Room
              </Button>
              
              <p className="text-xs text-gray-400 text-center">
                Share the room ID or link to invite your friend
              </p>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

export default RoomControls