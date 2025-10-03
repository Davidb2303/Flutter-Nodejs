const express = require('express');
const { 
  sendMessage, 
  getMessages, 
  markAsRead, 
  getRecentConversations 
} = require('../controllers/messageController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// POST /api/messages - Enviar un mensaje
router.post('/', sendMessage);

// GET /api/messages/conversations - Obtener conversaciones recientes
router.get('/conversations', getRecentConversations);

// GET /api/messages/match/:matchId - Obtener mensajes de un match
router.get('/match/:matchId', getMessages);

// PUT /api/messages/match/:matchId/read - Marcar mensajes como leídos
router.put('/match/:matchId/read', markAsRead);

module.exports = router;