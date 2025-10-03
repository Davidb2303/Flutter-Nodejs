const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Obtener usuarios potenciales para match (excluye usuarios ya evaluados)
const getPotentialMatches = async (req, res) => {
  try {
    const userId = req.userId;

    // Obtener IDs de usuarios ya evaluados (con swipe)
    const swipedUsers = await prisma.swipe.findMany({
      where: { userId },
      select: { targetId: true }
    });

    const swipedUserIds = swipedUsers.map(swipe => swipe.targetId);

    // Obtener usuarios potenciales (excluir el usuario actual y los ya evaluados)
    const potentialUsers = await prisma.user.findMany({
      where: {
        id: {
          not: userId,
          notIn: swipedUserIds
        }
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        age: true,
        photoUrl: true,
        interests: true,
        createdAt: true,
        updatedAt: true
      },
      take: 10 // Limitar a 10 usuarios por request
    });

    res.json(potentialUsers);

  } catch (error) {
    console.error('Error obteniendo usuarios potenciales:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener perfil de usuario
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        name: true,
        age: true,
        photoUrl: true,
        interests: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar perfil del usuario actual
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, age, photoUrl, interests } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (age !== undefined) updateData.age = parseInt(age);
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl;
    if (interests !== undefined) updateData.interests = JSON.stringify(interests);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        age: true,
        photoUrl: true,
        interests: true,
        updatedAt: true
      }
    });

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener perfil del usuario actual
const getMyProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        age: true,
        photoUrl: true,
        interests: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);

  } catch (error) {
    console.error('Error obteniendo mi perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getPotentialMatches,
  getUserProfile,
  updateProfile,
  getMyProfile
};