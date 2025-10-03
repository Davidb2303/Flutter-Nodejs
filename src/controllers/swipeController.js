const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Procesar un swipe (like o dislike)
const processSwipe = async (req, res) => {
  try {
    const userId = req.userId;
    const { targetId, isLike } = req.body;

    if (!targetId || isLike === undefined) {
      return res.status(400).json({ error: 'targetId e isLike son requeridos' });
    }

    const targetUserId = parseInt(targetId);

    // Verificar que no sea el mismo usuario
    if (userId === targetUserId) {
      return res.status(400).json({ error: 'No puedes hacer swipe a ti mismo' });
    }

    // Verificar que el usuario objetivo existe
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId }
    });

    if (!targetUser) {
      return res.status(404).json({ error: 'Usuario objetivo no encontrado' });
    }

    // Verificar si ya existe un swipe
    const existingSwipe = await prisma.swipe.findUnique({
      where: {
        userId_targetId: {
          userId,
          targetId: targetUserId
        }
      }
    });

    if (existingSwipe) {
      return res.status(400).json({ error: 'Ya evaluaste a este usuario' });
    }

    // Crear el swipe
    const swipe = await prisma.swipe.create({
      data: {
        userId,
        targetId: targetUserId,
        isLike
      }
    });

    let isMatch = false;

    // Si es like, verificar si hay match
    if (isLike) {
      const reciprocalSwipe = await prisma.swipe.findUnique({
        where: {
          userId_targetId: {
            userId: targetUserId,
            targetId: userId
          }
        }
      });

      // Si el otro usuario también dio like, es un match
      if (reciprocalSwipe && reciprocalSwipe.isLike) {
        isMatch = true;

        // Crear el match (evitar duplicados)
        const existingMatch = await prisma.match.findFirst({
          where: {
            OR: [
              { user1Id: userId, user2Id: targetUserId },
              { user1Id: targetUserId, user2Id: userId }
            ]
          }
        });

        if (!existingMatch) {
          await prisma.match.create({
            data: {
              user1Id: Math.min(userId, targetUserId),
              user2Id: Math.max(userId, targetUserId)
            }
          });
        }
      }
    }

    res.json({
      message: 'Swipe procesado exitosamente',
      swipe,
      isMatch
    });

  } catch (error) {
    console.error('Error procesando swipe:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener historial de swipes del usuario
const getMySwipes = async (req, res) => {
  try {
    const userId = req.userId;

    const swipes = await prisma.swipe.findMany({
      where: { userId },
      include: {
        target: {
          select: {
            id: true,
            username: true,
            name: true,
            photoUrl: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(swipes);

  } catch (error) {
    console.error('Error obteniendo swipes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  processSwipe,
  getMySwipes
};