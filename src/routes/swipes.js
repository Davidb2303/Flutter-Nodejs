const express = require('express');
const { processSwipe, getMySwipes } = require('../controllers/swipeController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// POST /api/swipes - Procesar un swipe (like o dislike)
router.post('/', processSwipe);

// GET /api/swipes/me - Obtener mi historial de swipes
router.get('/me', getMySwipes);

module.exports = router;