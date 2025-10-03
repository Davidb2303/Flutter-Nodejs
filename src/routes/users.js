const express = require('express');
const { 
  getPotentialMatches, 
  getUserProfile, 
  updateProfile, 
  getMyProfile 
} = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// GET /api/users/potential-matches - Obtener usuarios potenciales para match
router.get('/potential-matches', getPotentialMatches);

// GET /api/users/me - Obtener mi perfil
router.get('/me', getMyProfile);

// PUT /api/users/me - Actualizar mi perfil
router.put('/me', updateProfile);

// GET /api/users/:id - Obtener perfil de usuario específico
router.get('/:id', getUserProfile);

module.exports = router;