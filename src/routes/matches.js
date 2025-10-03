const express = require('express');
const { getMatches, getMatchDetails, unmatch } = require('../controllers/matchController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// GET /api/matches - Obtener todos mis matches
router.get('/', getMatches);

// GET /api/matches/:matchId - Obtener detalles de un match específico
router.get('/:matchId', getMatchDetails);

// DELETE /api/matches/:matchId - Deshacer un match
router.delete('/:matchId', unmatch);

module.exports = router;