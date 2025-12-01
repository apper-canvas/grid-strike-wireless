import apper from 'https://cdn.apper.io/actions/apper-actions.js'

// In-memory storage for rooms
const rooms = new Map()

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
    createdAt: Date.now(),
    lastActivity: Date.now(),
    lastActivityType: 'created',
    lastActivityData: null
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
  } else if (gameState.moveCount >= 9) {
    // Check for draw - all positions filled, no winner
    gameState.isDraw = true
  }
  
  // Switch to next player
  gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X'
  
  return room
}

function checkWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        symbol: board[a],
        line: lines[i]
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

// Update room's last activity timestamp for polling
function updateRoomActivity(roomId, activityType = 'general', data = null) {
  const room = rooms.get(roomId)
  if (!room) return
  
  room.lastActivity = Date.now()
  room.lastActivityType = activityType
  if (data) {
    room.lastActivityData = data
  }
}

apper.serve(async (req) => {
  try {
    const url = new URL(req.url)
    
    // Handle POST requests for game actions
    if (req.method === 'POST') {
      const body = await req.json()
      const action = body.action
      const playerId = body.playerId || `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      switch (action) {
        case 'CREATE_ROOM':
          try {
            const room = createRoom(playerId)
            updateRoomActivity(room.id, 'room_created', { playerId })
            
            return new Response(JSON.stringify({
              success: true,
              data: room
            }), {
              headers: { 'Content-Type': 'application/json' }
            })
          } catch (error) {
            return new Response(JSON.stringify({
              success: false,
              message: error.message
            }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            })
          }
          
        case 'JOIN_ROOM':
          try {
            const room = joinRoom(body.roomId, playerId)
            updateRoomActivity(body.roomId, 'player_joined', { 
              playerId,
              player: room.players.find(p => p.id === playerId)
            })
            
            return new Response(JSON.stringify({
              success: true,
              data: room
            }), {
              headers: { 'Content-Type': 'application/json' }
            })
          } catch (error) {
            return new Response(JSON.stringify({
              success: false,
              message: error.message
            }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            })
          }
          
        case 'MAKE_MOVE':
          try {
            const room = makeMove(body.roomId, playerId, body.position)
            updateRoomActivity(body.roomId, 'move_made', {
              playerId,
              position: body.position,
              gameState: room.gameState
            })
            
            return new Response(JSON.stringify({
              success: true,
              data: {
                gameState: room.gameState,
                room: room
              }
            }), {
              headers: { 'Content-Type': 'application/json' }
            })
          } catch (error) {
            return new Response(JSON.stringify({
              success: false,
              message: error.message
            }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            })
          }
          
        case 'NEW_GAME':
          try {
            const room = resetGame(body.roomId)
            updateRoomActivity(body.roomId, 'game_reset', {
              gameState: room.gameState
            })
            
            return new Response(JSON.stringify({
              success: true,
              data: {
                gameState: room.gameState,
                room: room
              }
            }), {
              headers: { 'Content-Type': 'application/json' }
            })
          } catch (error) {
            return new Response(JSON.stringify({
              success: false,
              message: error.message
            }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            })
          }
          
        default:
          return new Response(JSON.stringify({
            success: false,
            message: 'Unknown action'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          })
      }
    }

    // Handle GET requests for room information and polling
    if (req.method === 'GET') {
      const action = url.searchParams.get('action')
      
      if (action === 'room-state') {
        const roomId = url.searchParams.get('roomId')
        const lastUpdate = parseInt(url.searchParams.get('lastUpdate') || '0')
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
        
        // Only return data if there's been an update since last check
        const hasUpdate = !lastUpdate || room.lastActivity > lastUpdate
        
        return new Response(JSON.stringify({
          success: true,
          hasUpdate,
          data: hasUpdate ? {
            room,
            timestamp: Date.now()
          } : null
        }), {
          headers: { 'Content-Type': 'application/json' }
        })
      }
      
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
      
      return new Response(JSON.stringify({
        success: false,
        message: 'Unknown GET action'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Handle unsupported HTTP methods
    return new Response(JSON.stringify({
      success: false,
      message: 'Method not allowed'
    }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Internal server error: ' + error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})