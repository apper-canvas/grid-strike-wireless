import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"

const CreateRoom = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [roomData, setRoomData] = useState(null)

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const handleCreateRoom = async () => {
    setLoading(true)
    try {
      const roomId = generateRoomId()
      
      // Simulate room creation delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setRoomData({
        roomId,
        playerName: "Player 1",
        playersCount: 1,
        createdAt: new Date().toISOString()
      })
      
      toast.success("🎉 Room created successfully!", {
        position: "top-right",
        autoClose: 2000
      })
    } catch (error) {
      toast.error("Failed to create room. Please try again.", {
        position: "top-right",
        autoClose: 3000
      })
    } finally {
      setLoading(false)
    }
  }

  const handleJoinRoom = () => {
    if (roomData) {
      navigate(`/room/${roomData.roomId}`)
    }
  }

  const handleCopyRoomId = async () => {
    if (roomData) {
      try {
        await navigator.clipboard.writeText(roomData.roomId)
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
  }

  const handleGoBack = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loading className="mx-auto" />
          <p className="text-xl text-gray-300">Creating your room...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-display text-primary neon-text">
              Create Room
            </h1>
            <p className="text-gray-400">
              Create a room and invite your friend to play
            </p>
          </div>

          {!roomData ? (
            <div className="space-y-6">
              <Button
                onClick={handleCreateRoom}
                className="w-full h-14 text-lg bg-primary hover:bg-primary/80 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-neon flex items-center justify-center gap-3"
              >
                <ApperIcon name="Plus" size={24} />
                Create New Room
              </Button>
              
              <Button
                onClick={handleGoBack}
                className="w-full h-12 text-base bg-surface hover:bg-surface/80 text-white font-medium rounded-lg border-2 border-primary/20 hover:border-primary transition-all duration-200 flex items-center justify-center gap-2"
              >
                <ApperIcon name="ArrowLeft" size={20} />
                Back to Menu
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-surface/50 rounded-lg p-6 space-y-4">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-2">Room Created!</h3>
                  <div className="bg-background rounded-lg p-4 border-2 border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Room ID</p>
                        <p className="text-2xl font-bold text-primary font-mono">{roomData.roomId}</p>
                      </div>
                      <Button
                        onClick={handleCopyRoomId}
                        className="bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/20 hover:border-secondary/40 transition-all duration-200 p-2"
                      >
                        <ApperIcon name="Copy" size={20} />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-400">Players</p>
                    <p className="text-lg font-semibold text-white">{roomData.playersCount}/2</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <p className="text-lg font-semibold text-warning">Waiting</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleJoinRoom}
                  className="w-full h-14 text-lg bg-success hover:bg-success/80 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-neon flex items-center justify-center gap-3"
                >
                  <ApperIcon name="Play" size={24} />
                  Enter Room
                </Button>
                
                <Button
                  onClick={handleGoBack}
                  className="w-full h-12 text-base bg-surface hover:bg-surface/80 text-white font-medium rounded-lg border-2 border-primary/20 hover:border-primary transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <ApperIcon name="ArrowLeft" size={20} />
                  Back to Menu
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Share the Room ID with your friend to start playing!
                </p>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}

export default CreateRoom