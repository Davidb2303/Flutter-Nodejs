const express = require('express');
const { register, login, verifyToken } = require('../controllers/authController');
const { verifyToken: authMiddleware } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register - Registro de usuario
router.post('/register', register);

// POST /api/auth/login - Login de usuario
router.post('/login', login);

// GET /api/auth/verify - Verificar token JWT
router.get('/verify', authMiddleware, verifyToken);

module.exports = router;