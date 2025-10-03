const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Obtener todos los matches del usuario
const getMatches = async (req, res) => {
  try {
    const userId = req.userId;

    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      include: {
        user1: {
          select: {
            id: true,
            username: true,
            email: true,
            name: true,
            photoUrl: true,
            age: true,
            createdAt: true,
            updatedAt: true
          }
        },
        user2: {
          select: {
            id: true,
            username: true,
            email: true,
            name: true,
            photoUrl: true,
            age: true,
            createdAt: true,
            updatedAt: true
          }
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: {
            content: true,
            createdAt: true,
            senderId: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Formatear la respuesta para el frontend
    const formattedMatches = matches.map(match => {
      const otherUser = match.user1Id === userId ? match.user2 : match.user1;
      const lastMessage = match.messages[0] || null;

      return {
        id: match.id,
        user: otherUser,
        createdAt: match.createdAt,
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          createdAt: lastMessage.createdAt,
          isFromMe: lastMessage.senderId === userId
        } : null
      };
    });

    res.json(formattedMatches);

  } catch (error) {
    console.error('Error obteniendo matches:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener detalles de un match específico
const getMatchDetails = async (req, res) => {
  try {
    const userId = req.userId;
    const { matchId } = req.params;
    const matchIdInt = parseInt(matchId);

    const match = await prisma.match.findFirst({
      where: {
        id: matchIdInt,
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      include: {
        user1: {
          select: {
            id: true,
            username: true,
            name: true,
            photoUrl: true,
            age: true,
            interests: true
          }
        },
        user2: {
          select: {
            id: true,
            username: true,
            name: true,
            photoUrl: true,
            age: true,
            interests: true
          }
        }
      }
    });

    if (!match) {
      return res.status(404).json({ error: 'Match no encontrado' });
    }

    const otherUser = match.user1Id === userId ? match.user2 : match.user1;

    res.json({
      id: match.id,
      user: otherUser,
      createdAt: match.createdAt
    });

  } catch (error) {
    console.error('Error obteniendo detalles del match:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Deshacer un match (unmatch)
const unmatch = async (req, res) => {
  try {
    const userId = req.userId;
    const { matchId } = req.params;
    const matchIdInt = parseInt(matchId);

    // Verificar que el match existe y pertenece al usuario
    const match = await prisma.match.findFirst({
      where: {
        id: matchIdInt,
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      }
    });

    if (!match) {
      return res.status(404).json({ error: 'Match no encontrado' });
    }

    // Eliminar el match y sus mensajes
    await prisma.message.deleteMany({
      where: { matchId: matchIdInt }
    });

    await prisma.match.delete({
      where: { id: matchIdInt }
    });

    res.json({ message: 'Match eliminado exitosamente' });

  } catch (error) {
    console.error('Error eliminando match:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getMatches,
  getMatchDetails,
  unmatch
};