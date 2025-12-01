import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import GameInterface from "@/components/organisms/GameInterface"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const GamePage = () => {
  const navigate = useNavigate()
  const [showLocalGame, setShowLocalGame] = useState(false)

  const handleCreateRoom = () => {
    navigate('/create-room')
  }

  const handleJoinRoom = () => {
    navigate('/join-room')
  }

  const handleLocalGame = () => {
    setShowLocalGame(true)
    toast.info("🎮 Starting local game mode!", {
      position: "top-right",
      autoClose: 1500
    })
  }

  if (showLocalGame) {
    return <GameInterface />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-4">
          <motion.h1 
            className="text-6xl font-display text-primary neon-text"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            Grid Strike
          </motion.h1>
          <p className="text-xl text-gray-300">Choose your game mode</p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleCreateRoom}
            className="w-full h-14 text-lg bg-primary hover:bg-primary/80 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-neon flex items-center justify-center gap-3"
          >
            <ApperIcon name="Plus" size={24} />
            Create Room
          </Button>

          <Button
            onClick={handleJoinRoom}
            className="w-full h-14 text-lg bg-secondary hover:bg-secondary/80 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-neon flex items-center justify-center gap-3"
          >
            <ApperIcon name="Users" size={24} />
            Join Room
          </Button>

          <Button
            onClick={handleLocalGame}
            className="w-full h-14 text-lg bg-surface hover:bg-surface/80 text-white font-semibold rounded-lg border-2 border-primary/20 hover:border-primary transition-all duration-200 flex items-center justify-center gap-3"
          >
            <ApperIcon name="Gamepad2" size={24} />
            Local Game
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            Create or join a room to play with friends online, or play locally
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default GamePage