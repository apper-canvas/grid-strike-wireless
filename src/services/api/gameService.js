import gameHistoryData from "@/services/mockData/gameHistory.json"

class GameService {
constructor() {
    // WebSocket properties
    this.socket = null
    this.roomId = null
    this.playerRole = null
    this.eventListeners = new Map()
    
    // Game history properties
    this.gameHistory = [...gameHistoryData]
  }

  // WebSocket connection management
  connectToRoom(roomId, playerRole) {
    try {
      // Initialize WebSocket connection
      // In real implementation, this would connect to the room-websocket Edge Function
      this.roomId = roomId
      this.playerRole = playerRole
      
      // Simulate WebSocket connection
      console.log(`Connecting to room ${roomId} as player ${playerRole}`)
      
      return true
    } catch (error) {
      console.error('Failed to connect to room:', error)
      return false
    }
  }

  // Send move to other players
  async sendMove(roomId, moveData) {
    if (!this.socket) {
      console.warn('No WebSocket connection available')
      return false
    }

    try {
      // In real implementation, send via WebSocket to room-websocket Edge Function
      const message = {
        type: 'PLAYER_MOVE',
        roomId,
        data: moveData,
        timestamp: Date.now()
      }
      
      console.log('Sending move:', message)
      // this.socket.send(JSON.stringify(message))
      
      return true
    } catch (error) {
      console.error('Failed to send move:', error)
      return false
    }
  }

  // Request new game
  async requestNewGame(roomId) {
    if (!this.socket) {
      console.warn('No WebSocket connection available')
      return false
    }

    try {
      const message = {
        type: 'NEW_GAME_REQUEST',
        roomId,
        timestamp: Date.now()
      }
      
      console.log('Requesting new game:', message)
      // this.socket.send(JSON.stringify(message))
      
      return true
    } catch (error) {
      console.error('Failed to request new game:', error)
      return false
    }
  }

  // Event listeners for multiplayer events
  onOpponentMove(callback) {
    this.eventListeners.set('opponentMove', callback)
  }

  onPlayerDisconnect(callback) {
    this.eventListeners.set('playerDisconnect', callback)
  }

  onPlayerReconnect(callback) {
    this.eventListeners.set('playerReconnect', callback)
  }

  onNewGameRequest(callback) {
    this.eventListeners.set('newGameRequest', callback)
  }

  // Remove event listeners
  removeAllListeners() {
    this.eventListeners.clear()
  }

  // Disconnect from room
  disconnect() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
    this.roomId = null
    this.playerRole = null
    this.eventListeners.clear()
  }

  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getGameHistory() {
    await this.delay(200)
    return [...this.gameHistory]
  }

  async saveGame(gameData) {
    await this.delay(250)
    const maxId = this.gameHistory.length > 0 
      ? Math.max(...this.gameHistory.map(g => g.Id))
      : 0
    
    const newGame = {
      Id: maxId + 1,
      board: [...gameData.board],
      winner: gameData.winner,
      moves: gameData.moves,
      timestamp: Date.now()
    }
    
    this.gameHistory.push(newGame)
    return { ...newGame }
  }

  async getGameById(id) {
    await this.delay(150)
    const game = this.gameHistory.find(g => g.Id === parseInt(id))
    return game ? { ...game } : null
  }

  async clearHistory() {
    await this.delay(200)
    this.gameHistory = []
    return true
  }

  // AI Logic for single player mode
  getBestMove(board, difficulty = "medium") {
    const availableMoves = board
      .map((cell, index) => cell === "" ? index : null)
      .filter(index => index !== null)

    if (availableMoves.length === 0) return null

    switch (difficulty) {
      case "easy":
        return this.getRandomMove(availableMoves)
      case "medium":
        return this.getMediumMove(board, availableMoves)
      case "hard":
        return this.getHardMove(board, availableMoves)
      default:
        return this.getMediumMove(board, availableMoves)
    }
  }

  getRandomMove(availableMoves) {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)]
  }

  getMediumMove(board, availableMoves) {
    // Try to win first
    const winMove = this.findWinningMove(board, "O")
    if (winMove !== null) return winMove

    // Block player from winning
    const blockMove = this.findWinningMove(board, "X")
    if (blockMove !== null) return blockMove

    // Take center if available
    if (availableMoves.includes(4)) return 4

    // Take corners
    const corners = [0, 2, 6, 8].filter(pos => availableMoves.includes(pos))
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)]
    }

    // Random move
    return this.getRandomMove(availableMoves)
  }

  getHardMove(board, availableMoves) {
    return this.minimax(board, 0, true, "O").index
  }

  findWinningMove(board, player) {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ]

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern
      const line = [board[a], board[b], board[c]]
      const playerCount = line.filter(cell => cell === player).length
      const emptyCount = line.filter(cell => cell === "").length

      if (playerCount === 2 && emptyCount === 1) {
        if (board[a] === "") return a
        if (board[b] === "") return b
        if (board[c] === "") return c
      }
    }

    return null
  }

  minimax(board, depth, isMaximizing, aiPlayer) {
    const humanPlayer = aiPlayer === "O" ? "X" : "O"
    const winner = this.checkWinner(board)

    if (winner === aiPlayer) return { score: 10 - depth }
    if (winner === humanPlayer) return { score: depth - 10 }
    if (board.every(cell => cell !== "")) return { score: 0 }

    const availableMoves = board
      .map((cell, index) => cell === "" ? index : null)
      .filter(index => index !== null)

    if (isMaximizing) {
      let bestScore = -Infinity
      let bestMove = null

      for (const move of availableMoves) {
        board[move] = aiPlayer
        const result = this.minimax(board, depth + 1, false, aiPlayer)
        board[move] = ""

        if (result.score > bestScore) {
          bestScore = result.score
          bestMove = move
        }
      }

      return { score: bestScore, index: bestMove }
    } else {
      let bestScore = Infinity
      let bestMove = null

      for (const move of availableMoves) {
        board[move] = humanPlayer
        const result = this.minimax(board, depth + 1, true, aiPlayer)
        board[move] = ""

        if (result.score < bestScore) {
          bestScore = result.score
          bestMove = move
        }
      }

      return { score: bestScore, index: bestMove }
    }
  }

  checkWinner(board) {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ]

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]
      }
    }

    return null
  }

  getWinningLine(board) {
    const winPatterns = [
      { pattern: [0, 1, 2], type: "horizontal", row: 0 },
      { pattern: [3, 4, 5], type: "horizontal", row: 1 },
      { pattern: [6, 7, 8], type: "horizontal", row: 2 },
      { pattern: [0, 3, 6], type: "vertical", col: 0 },
      { pattern: [1, 4, 7], type: "vertical", col: 1 },
      { pattern: [2, 5, 8], type: "vertical", col: 2 },
      { pattern: [0, 4, 8], type: "diagonal", diagonal: 1 },
      { pattern: [2, 4, 6], type: "diagonal", diagonal: 2 }
    ]

    for (const { pattern, type, row, col, diagonal } of winPatterns) {
      const [a, b, c] = pattern
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { pattern, type, row, col, diagonal }
      }
    }

    return null
  }
}

export default new GameService()