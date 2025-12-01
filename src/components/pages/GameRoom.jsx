import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import GameInterface from "@/components/organisms/GameInterface"
import { Card } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"

const GameRoom = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [roomState, setRoomState] = useState({
    isLoading: true,
    isConnected: false,
    players: [],
    gameStarted: false,
    playerRole: null, // 'X' or 'O'
    waitingForPlayer: true
  })

  useEffect(() => {
    // Simulate connecting to room
    const connectToRoom = async () => {
      try {
        setRoomState(prev => ({ ...prev, isLoading: true }))
        
        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Simulate joining as second player if room has 1 player
        const isSecondPlayer = Math.random() > 0.3 // 70% chance of being second player
        
        setRoomState(prev => ({
          ...prev,
          isLoading: false,
          isConnected: true,
          players: isSecondPlayer ? 
            [{ id: 'player1', name: 'Player 1', symbol: 'X' }, { id: 'player2', name: 'You', symbol: 'O' }] :
            [{ id: 'player1', name: 'You', symbol: 'X' }],
          playerRole: isSecondPlayer ? 'O' : 'X',
          gameStarted: isSecondPlayer,
          waitingForPlayer: !isSecondPlayer
        }))

        if (isSecondPlayer) {
          toast.success("🎮 Game started! You are playing as O", {
            position: "top-right",
            autoClose: 3000
          })
        } else {
          toast.info("⏳ Waiting for second player to join...", {
            position: "top-right",
            autoClose: 3000
          })
          
          // Simulate second player joining after some time
          setTimeout(() => {
            setRoomState(prev => ({
              ...prev,
              players: [...prev.players, { id: 'player2', name: 'Player 2', symbol: 'O' }],
              gameStarted: true,
              waitingForPlayer: false
            }))
            
            toast.success("🎉 Player 2 joined! Game started!", {
              position: "top-right",
              autoClose: 3000
            })
          }, 5000)
        }
      } catch (error) {
        toast.error("Failed to connect to room", {
          position: "top-right",
          autoClose: 3000
        })
        navigate('/')
      }
    }

    if (roomId) {
      connectToRoom()
    }
  }, [roomId, navigate])

  const handleLeaveRoom = () => {
    toast.info("👋 Leaving room...", {
      position: "top-right",
      autoClose: 1500
    })
    navigate('/')
  }

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

  if (roomState.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <Loading className="mx-auto w-12 h-12" />
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white">Connecting to Room</h2>
            <p className="text-gray-400">Room ID: <span className="font-mono text-primary">{roomId}</span></p>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!roomState.isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface flex items-center justify-center p-6">
        <Card className="p-8 text-center space-y-6 max-w-md">
          <div className="text-6xl">❌</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white">Connection Failed</h2>
            <p className="text-gray-400">Unable to connect to room {roomId}</p>
          </div>
          <Button
            onClick={() => navigate('/')}
            className="w-full bg-primary hover:bg-primary/80"
          >
            Back to Menu
          </Button>
        </Card>
      </div>
    )
  }

  if (roomState.waitingForPlayer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 space-y-6 text-center">
            <div className="space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-6xl mx-auto"
              >
                ⏳
              </motion.div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-white">Waiting for Player</h2>
                <p className="text-gray-400">Share the room ID with your friend</p>
              </div>
            </div>

            <div className="bg-surface/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Room ID</p>
                  <p className="text-2xl font-bold text-primary font-mono">{roomId}</p>
                </div>
                <Button
                  onClick={handleCopyRoomId}
                  className="bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/20 hover:border-secondary/40 transition-all duration-200 p-2"
                >
                  <ApperIcon name="Copy" size={20} />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-400">Players</p>
                  <p className="text-lg font-semibold text-white">{roomState.players.length}/2</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Your Symbol</p>
                  <p className="text-lg font-semibold text-primary">{roomState.playerRole}</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleLeaveRoom}
              className="w-full bg-surface hover:bg-surface/80 text-white border-2 border-primary/20 hover:border-primary transition-all duration-200"
            >
              <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
              Leave Room
            </Button>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface">
      <div className="container mx-auto p-6">
        {/* Room Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">Room {roomId}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Players: {roomState.players.length}/2</span>
                    <span>You are: <span className="text-primary font-semibold">{roomState.playerRole}</span></span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleCopyRoomId}
                  className="bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/20 hover:border-secondary/40 transition-all duration-200 px-3 py-2"
                >
                  <ApperIcon name="Copy" size={16} />
                </Button>
                
                <Button
                  onClick={handleLeaveRoom}
                  className="bg-surface hover:bg-surface/80 text-white border-2 border-primary/20 hover:border-primary transition-all duration-200 px-3 py-2"
                >
                  <ApperIcon name="LogOut" size={16} />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Game Interface */}
        <GameInterface
          isMultiplayer={true}
          roomId={roomId}
          playerRole={roomState.playerRole}
          players={roomState.players}
        />
      </div>
    </div>
  )
}

export default GameRoom