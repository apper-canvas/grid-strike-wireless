import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import gameService from "@/services/api/gameService";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import GameControls from "@/components/molecules/GameControls";
import ScorePanel from "@/components/molecules/ScorePanel";
import RoomControls from "@/components/molecules/RoomControls";
import GameBoard from "@/components/molecules/GameBoard";
import GameStatus from "@/components/molecules/GameStatus";

const GameInterface = ({ 
  isMultiplayer = false, 
  roomId = null, 
  playerRole = null, 
  players = [] 
}) => {
// Game state
  const [board, setBoard] = useState(Array(9).fill(""))
  const [currentPlayer, setCurrentPlayer] = useState("X")
  const [winner, setWinner] = useState(null)
  const [winningLine, setWinningLine] = useState(null)
  const [isDraw, setIsDraw] = useState(false)
  const [moveCount, setMoveCount] = useState(0)
  
  // Game settings
  const [gameMode, setGameMode] = useState(isMultiplayer ? "multiplayer" : "two-player")
  const [difficulty, setDifficulty] = useState("medium")
  
  // Multiplayer state
  const [isMyTurn, setIsMyTurn] = useState(isMultiplayer ? playerRole === "X" : true)
  const [opponentConnected, setOpponentConnected] = useState(isMultiplayer ? players.length === 2 : false)
  const [roomState, setRoomState] = useState({
    players: players || [],
    spectators: 0
  })
  
  // Scores
  const [scores, setScores] = useState({
    xWins: 0,
    oWins: 0,
    draws: 0
  })
  
  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  // Load initial scores from localStorage
  useEffect(() => {
    const savedScores = localStorage.getItem("gridStrikeScores")
    if (savedScores) {
      try {
        setScores(JSON.parse(savedScores))
      } catch (error) {
        console.warn("Failed to load saved scores:", error)
      }
    }
  }, [])

  // Save scores to localStorage
  useEffect(() => {
    localStorage.setItem("gridStrikeScores", JSON.stringify(scores))
  }, [scores])

  // Check for winner
  const checkGameEnd = useCallback((gameBoard) => {
    const winner = gameService.checkWinner(gameBoard)
    const winLine = gameService.getWinningLine(gameBoard)
    
    if (winner) {
      setWinner(winner)
      setWinningLine(winLine)
      
      // Update scores
      setScores(prev => ({
        ...prev,
        [winner === "X" ? "xWins" : "oWins"]: prev[winner === "X" ? "xWins" : "oWins"] + 1
      }))
      
      // Save game to history
      saveGameHistory(gameBoard, winner, moveCount + 1)
      
      // Show celebration toast
      toast.success(`🎉 Player ${winner} wins!`, {
        position: "top-center",
        autoClose: 2000
      })
      
      return true
    }
    
    // Check for draw
    if (gameBoard.every(cell => cell !== "")) {
      setIsDraw(true)
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }))
      saveGameHistory(gameBoard, "draw", 9)
      
      toast.info("🤝 It's a draw!", {
        position: "top-center",
        autoClose: 2000
      })
      
      return true
    }
    
    return false
  }, [moveCount])

  // Save game to history
  const saveGameHistory = async (gameBoard, gameWinner, totalMoves) => {
    try {
      await gameService.saveGame({
        board: gameBoard,
        winner: gameWinner,
        moves: totalMoves
      })
    } catch (error) {
      console.warn("Failed to save game history:", error)
    }
  }

  // Handle cell click
const handleCellClick = useCallback(async (position) => {
    if (board[position] !== "" || winner || isDraw || loading) return
    
    // In multiplayer, check if it's the player's turn
    if (isMultiplayer) {
      if (!isMyTurn) {
        toast.warning("It's not your turn!", {
          position: "top-right",
          autoClose: 1500
        })
        return
      }
      
      if (currentPlayer !== playerRole) {
        toast.warning("Wait for your turn!", {
          position: "top-right",
          autoClose: 1500
        })
        return
      }
      
      if (!opponentConnected) {
        toast.warning("Waiting for opponent to connect!", {
          position: "top-right",
          autoClose: 2000
        })
        return
      }
    }

    const newBoard = [...board]
    newBoard[position] = currentPlayer
    setBoard(newBoard)
    setMoveCount(prev => prev + 1)
    
    // In multiplayer, send move to other player
if (isMultiplayer) {
      setIsMyTurn(false)
      // Send the move via HTTP polling service
      try {
        await gameService.sendMove(roomId, position)
      } catch (error) {
        toast.error("Failed to send move", {
          position: "top-right",
          autoClose: 2000
        })
        // Revert the move on error
        setBoard(board)
        setCurrentPlayer(currentPlayer)
        setMoveCount(moveCount)
        setIsMyTurn(true)
      }
    }

    // Check if game ended with this move
    if (checkGameEnd(newBoard)) return

    // Switch to next player
    const nextPlayer = currentPlayer === "X" ? "O" : "X"
    setCurrentPlayer(nextPlayer)
    
    // In multiplayer, the turn will be handled by WebSocket events
    if (isMultiplayer) {
      // Turn management handled by real-time sync
      return
    }

    // AI move in single player mode
    if (gameMode === "single" && nextPlayer === "O") {
      setLoading(true)
      
      // Add delay for better UX
      setTimeout(() => {
        const aiMove = gameService.getBestMove(newBoard, difficulty)
        
        if (aiMove !== null) {
          const aiBoard = [...newBoard]
          aiBoard[aiMove] = "O"
          setBoard(aiBoard)
          setMoveCount(prev => prev + 1)
          
          // Check if AI won
          if (!checkGameEnd(aiBoard)) {
            setCurrentPlayer("X")
          }
        }
        
        setLoading(false)
      }, 500)
    }
  }, [board, currentPlayer, winner, isDraw, loading, gameMode, difficulty, checkGameEnd, isMultiplayer, isMyTurn, playerRole, opponentConnected, roomId])

// Start new game
  const handleNewGame = async () => {
    setBoard(Array(9).fill(""))
    setCurrentPlayer("X")
    setWinner(null)
    setWinningLine(null)
    setIsDraw(false)
    setMoveCount(0)
    setError("")
    
    // In multiplayer, reset turn state
    if (isMultiplayer) {
      setIsMyTurn(playerRole === "X")
      // Send new game request via HTTP polling service
      try {
        await gameService.requestNewGame(roomId)
      } catch (error) {
        toast.error("Failed to start new game", {
          position: "top-right",
          autoClose: 2000
        })
      }
    }
    
    toast.info("🎮 New game started!", {
      position: "top-right",
      autoClose: 1500
    })
  }

  // Change game mode (not available in multiplayer)
  const handleModeChange = (mode) => {
    if (isMultiplayer) {
      toast.warning("Cannot change mode in multiplayer!", {
        position: "top-right",
        autoClose: 2000
      })
      return
    }
    
    if (moveCount > 0) {
      toast.warning("Finish current game to change mode!", {
        position: "top-right",
        autoClose: 2000
      })
      return
    }
    
    setGameMode(mode)
    handleNewGame()
    
    toast.success(`🎯 Switched to ${mode === "single" ? "single player" : "two player"} mode!`, {
      position: "top-right",
      autoClose: 2000
    })
  }

  // Change difficulty (not available in multiplayer)
  const handleDifficultyChange = (newDifficulty) => {
    if (isMultiplayer) {
      toast.warning("Cannot change difficulty in multiplayer!", {
        position: "top-right",
        autoClose: 2000
      })
      return
    }
    
    if (moveCount > 0) {
      toast.warning("Finish current game to change difficulty!", {
        position: "top-right",
        autoClose: 2000
      })
      return
    }
    
    setDifficulty(newDifficulty)
    
    toast.success(`🧠 Difficulty set to ${newDifficulty}!`, {
      position: "top-right",
      autoClose: 2000
    })
  }

  // Handle multiplayer events
useEffect(() => {
    if (!isMultiplayer || !roomId) return

    // Set up polling-based room updates
    const handleRoomUpdate = (room) => {
      if (!room || !room.gameState) return

      const { gameState } = room
      
      // Update game state from polling
      setBoard(gameState.board)
      setCurrentPlayer(gameState.currentPlayer)
      setMoveCount(gameState.moveCount)
      setWinner(gameState.winner)
      setIsDraw(gameState.isDraw)
      setWinningLine(gameState.winningLine)
      
      // Update turn state
      if (gameState.winner || gameState.isDraw) {
        setIsMyTurn(false)
      } else {
        setIsMyTurn(gameState.currentPlayer === playerRole)
      }
      
      // Update opponent connection status
      setOpponentConnected(room.players.length === 2)
    }

    // Set up room update listener for polling
    gameService.onRoomUpdate(handleRoomUpdate)

    // Player disconnect/reconnect handlers
    gameService.onPlayerDisconnect(() => setOpponentConnected(false))
    gameService.onPlayerReconnect(() => setOpponentConnected(true))

    // Cleanup function
    return () => {
      gameService.removeAllListeners()
    }
  }, [isMultiplayer, roomId, playerRole])

  // Clear scores
  const handleClearScore = () => {
    setScores({ xWins: 0, oWins: 0, draws: 0 })
    localStorage.removeItem("gridStrikeScores")
    
    toast.success("🗑️ Scores cleared!", {
      position: "top-right",
      autoClose: 1500
    })
  }

  if (error) {
    return <ErrorView message={error} onRetry={() => setError("")} />
  }

  const isGameActive = moveCount > 0 && !winner && !isDraw

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div 
          className="text-center py-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-display text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-success neon-text mb-4">
            Grid Strike
          </h1>
          <p className="text-white/70 text-lg font-sans">
            Experience the future of tic-tac-toe
          </p>
        </motion.div>

        {/* Game Interface */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left Panel - Scores */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-2 lg:order-1"
          >
            <ScorePanel 
              xWins={scores.xWins}
              oWins={scores.oWins}
              draws={scores.draws}
            />
          </motion.div>

          {/* Center Panel - Game Board */}
          <motion.div 
            className="order-1 lg:order-2 space-y-6"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
<GameStatus 
              currentPlayer={currentPlayer}
              winner={winner}
              isDraw={isDraw}
              gameMode={gameMode}
              isMultiplayer={isMultiplayer}
              playerRole={playerRole}
              isMyTurn={isMyTurn}
              opponentConnected={opponentConnected}
            />
            
            <div className="relative">
              <GameBoard
                board={board}
                onCellClick={handleCellClick}
                disabled={loading || winner || isDraw}
                winningLine={winningLine}
              />
              
              <AnimatePresence>
                {loading && (
                  <motion.div
                    className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="text-center space-y-3">
                      <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-secondary font-semibold">AI Thinking...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Panel - Controls */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="order-3"
>
            {isMultiplayer ? (
              <RoomControls
                roomId={roomId}
                players={roomState.players}
                playerRole={playerRole}
                onNewGame={handleNewGame}
                onClearScore={handleClearScore}
                isGameActive={isGameActive}
                opponentConnected={opponentConnected}
              />
            ) : (
              <GameControls
                gameMode={gameMode}
                onModeChange={handleModeChange}
                difficulty={difficulty}
                onDifficultyChange={handleDifficultyChange}
                onNewGame={handleNewGame}
                onClearScore={handleClearScore}
                isGameActive={isGameActive}
              />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default GameInterface