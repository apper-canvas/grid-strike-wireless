import apper from 'https://cdn.apper.io/actions/apper-actions.js'

// In-memory storage for active rooms and connections
const rooms = new Map()
const connections = new Map()

function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

function createRoom(playerId) {
  const roomId = generateRoomId()
  const room = {
    id: roomId,
    players: [{ id: playerId, symbol: 'X', connected: true }],
    gameState: {
      board: Array(9).fill(''),
      currentPlayer: 'X',
      winner: null,
      isDraw: false,
      moveCount: 0
    },
    createdAt: Date.now()
  }
  
  rooms.set(roomId, room)
  return room
}

function joinRoom(roomId, playerId) {
  const room = rooms.get(roomId)
  if (!room) {
    throw new Error('Room not found')
  }
  
  if (room.players.length >= 2) {
    throw new Error('Room is full')
  }
  
  // Check if player is already in room
  const existingPlayer = room.players.find(p => p.id === playerId)
  if (existingPlayer) {
    existingPlayer.connected = true
    return room
  }
  
  // Add new player
  room.players.push({ 
    id: playerId, 
    symbol: 'O', 
    connected: true 
  })
  
  return room
}

function makeMove(roomId, playerId, position) {
  const room = rooms.get(roomId)
  if (!room) {
    throw new Error('Room not found')
  }
  
  const player = room.players.find(p => p.id === playerId)
  if (!player) {
    throw new Error('Player not in room')
  }
  
  const { gameState } = room
  
  // Validate move
  if (gameState.board[position] !== '') {
    throw new Error('Position already occupied')
  }
  
  if (gameState.winner || gameState.isDraw) {
    throw new Error('Game is already finished')
  }
  
  if (player.symbol !== gameState.currentPlayer) {
    throw new Error('Not your turn')
  }
  
  // Make the move
  gameState.board[position] = player.symbol
  gameState.moveCount++
  
  // Check for winner
  const winner = checkWinner(gameState.board)
  if (winner) {
    gameState.winner = winner.symbol
    gameState.winningLine = winner.line
  } else if (gameState.moveCount === 9) {
    gameState.isDraw = true
  } else {
    // Switch to next player
    gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X'
  }
  
  return room
}

function checkWinner(board) {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ]
  
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i]
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        symbol: board[a],
        line: winningCombinations[i]
      }
    }
  }
  
  return null
}

function resetGame(roomId) {
  const room = rooms.get(roomId)
  if (!room) {
    throw new Error('Room not found')
  }
  
  room.gameState = {
    board: Array(9).fill(''),
    currentPlayer: 'X',
    winner: null,
    isDraw: false,
    moveCount: 0
  }
  
  return room
}

function broadcastToRoom(roomId, message, excludePlayerId = null) {
  const room = rooms.get(roomId)
  if (!room) return
  
  room.players.forEach(player => {
    if (player.id !== excludePlayerId) {
      const connection = connections.get(player.id)
      if (connection && connection.readyState === WebSocket.OPEN) {
        try {
          connection.send(JSON.stringify(message))
        } catch (error) {
          console.error('Failed to send message to player:', error)
        }
      }
    }
  })
}

apper.serve(async (req) => {
  try {
    const url = new URL(req.url)
    
    // Handle WebSocket upgrade
    if (req.headers.get('upgrade') === 'websocket') {
      const { socket, response } = await apper.upgradeWebSocket(req)
      
      const playerId = url.searchParams.get('playerId') || `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      connections.set(playerId, socket)
      
      socket.onmessage = async (event) => {
        try {
          const message = JSON.parse(event.data)
          
          switch (message.type) {
            case 'CREATE_ROOM':
              try {
                const room = createRoom(playerId)
                socket.send(JSON.stringify({
                  type: 'ROOM_CREATED',
                  success: true,
                  data: room
                }))
              } catch (error) {
                socket.send(JSON.stringify({
                  type: 'ERROR',
                  success: false,
                  message: error.message
                }))
              }
              break
              
            case 'JOIN_ROOM':
              try {
                const room = joinRoom(message.roomId, playerId)
                
                // Notify player they joined
                socket.send(JSON.stringify({
                  type: 'ROOM_JOINED',
                  success: true,
                  data: room
                }))
                
                // Notify other players
                broadcastToRoom(message.roomId, {
                  type: 'PLAYER_JOINED',
                  data: {
                    player: room.players.find(p => p.id === playerId),
                    room
                  }
                }, playerId)
                
              } catch (error) {
                socket.send(JSON.stringify({
                  type: 'ERROR',
                  success: false,
                  message: error.message
                }))
              }
              break
              
            case 'MAKE_MOVE':
              try {
                const room = makeMove(message.roomId, playerId, message.position)
                
                // Broadcast move to all players in room
                broadcastToRoom(message.roomId, {
                  type: 'MOVE_MADE',
                  data: {
                    playerId,
                    position: message.position,
                    gameState: room.gameState
                  }
                })
                
              } catch (error) {
                socket.send(JSON.stringify({
                  type: 'ERROR',
                  success: false,
                  message: error.message
                }))
              }
              break
              
            case 'NEW_GAME':
              try {
                const room = resetGame(message.roomId)
                
                // Broadcast new game to all players
                broadcastToRoom(message.roomId, {
                  type: 'GAME_RESET',
                  data: {
                    gameState: room.gameState
                  }
                })
                
              } catch (error) {
                socket.send(JSON.stringify({
                  type: 'ERROR',
                  success: false,
                  message: error.message
                }))
              }
              break
              
            case 'PING':
              socket.send(JSON.stringify({
                type: 'PONG',
                timestamp: Date.now()
              }))
              break
              
            default:
              socket.send(JSON.stringify({
                type: 'ERROR',
                success: false,
                message: 'Unknown message type'
              }))
          }
        } catch (error) {
          socket.send(JSON.stringify({
            type: 'ERROR',
            success: false,
            message: 'Invalid message format'
          }))
        }
      }
      
      socket.onclose = () => {
        // Mark player as disconnected in all rooms
        for (const [roomId, room] of rooms) {
          const player = room.players.find(p => p.id === playerId)
          if (player) {
            player.connected = false
            
            // Notify other players
            broadcastToRoom(roomId, {
              type: 'PLAYER_DISCONNECTED',
              data: { playerId, player }
            }, playerId)
          }
        }
        
        connections.delete(playerId)
      }
      
      socket.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
      
      return response
    }
    
    // Handle HTTP requests
    if (req.method === 'GET') {
      const action = url.searchParams.get('action')
      
      if (action === 'room-info') {
        const roomId = url.searchParams.get('roomId')
        const room = rooms.get(roomId)
        
        if (!room) {
          return new Response(JSON.stringify({
            success: false,
            message: 'Room not found'
          }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          })
        }
        
        return new Response(JSON.stringify({
          success: true,
          data: room
        }), {
          headers: { 'Content-Type': 'application/json' }
        })
      }
      
      if (action === 'active-rooms') {
        const activeRooms = Array.from(rooms.values()).map(room => ({
          id: room.id,
          playerCount: room.players.length,
          gameStarted: room.players.length === 2,
          createdAt: room.createdAt
        }))
        
        return new Response(JSON.stringify({
          success: true,
          data: activeRooms
        }), {
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Invalid request'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('Edge function error:', error)
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})