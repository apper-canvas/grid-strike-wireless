import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"

const JoinRoom = () => {
  const navigate = useNavigate()
  const [roomId, setRoomId] = useState("")
  const [loading, setLoading] = useState(false)

  const handleJoinRoom = async () => {
    if (!roomId.trim()) {
      toast.warning("Please enter a room ID", {
        position: "top-right",
        autoClose: 2000
      })
      return
    }

    setLoading(true)
    try {
      // Simulate room validation delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo, accept any 6-character room ID
      if (roomId.trim().length !== 6) {
        throw new Error("Invalid room ID format")
      }
      
      toast.success("✅ Joining room...", {
        position: "top-right",
        autoClose: 1500
      })
      
      // Navigate to room
      navigate(`/room/${roomId.trim().toUpperCase()}`)
    } catch (error) {
      toast.error("Room not found. Please check the room ID.", {
        position: "top-right",
        autoClose: 3000
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoBack = () => {
    navigate('/')
  }

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (value.length <= 6) {
      setRoomId(value)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleJoinRoom()
    }
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
            <h1 className="text-3xl font-display text-secondary neon-text">
              Join Room
            </h1>
            <p className="text-gray-400">
              Enter the room ID to join your friend's game
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Room ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={roomId}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter 6-character room ID"
                  className="w-full h-14 px-4 bg-surface/50 border-2 border-primary/20 rounded-lg text-white text-xl font-mono text-center placeholder-gray-500 focus:outline-none focus:border-primary transition-all duration-200"
                  maxLength={6}
                  disabled={loading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <ApperIcon name="Hash" size={20} />
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Room ID should be exactly 6 characters
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleJoinRoom}
                disabled={loading || roomId.trim().length !== 6}
                className="w-full h-14 text-lg bg-secondary hover:bg-secondary/80 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-neon flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loading className="w-6 h-6" />
                    Joining...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Users" size={24} />
                    Join Room
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleGoBack}
                disabled={loading}
                className="w-full h-12 text-base bg-surface hover:bg-surface/80 text-white font-medium rounded-lg border-2 border-primary/20 hover:border-primary transition-all duration-200 flex items-center justify-center gap-2"
              >
                <ApperIcon name="ArrowLeft" size={20} />
                Back to Menu
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-400">
                Ask your friend for their room ID to get started
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default JoinRoom