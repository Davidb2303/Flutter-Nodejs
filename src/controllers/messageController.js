const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Enviar un mensaje
const sendMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { matchId, content } = req.body;

    if (!matchId || !content) {
      return res.status(400).json({ error: 'matchId y content son requeridos' });
    }

    const matchIdInt = parseInt(matchId);

    // Verificar que el match existe y el usuario es parte de él
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

    // Determinar el receptor
    const receiverId = match.user1Id === userId ? match.user2Id : match.user1Id;

    // Crear el mensaje
    const message = await prisma.message.create({
      data: {
        matchId: matchIdInt,
        senderId: userId,
        receiverId,
        content: content.trim()
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            name: true,
            photoUrl: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Mensaje enviado exitosamente',
      data: message
    });

  } catch (error) {
    console.error('Error enviando mensaje:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener mensajes de un match
const getMessages = async (req, res) => {
  try {
    const userId = req.userId;
    const { matchId } = req.params;
    const matchIdInt = parseInt(matchId);

    // Verificar que el match existe y el usuario es parte de él
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

    // Obtener mensajes del match
    const messages = await prisma.message.findMany({
      where: { matchId: matchIdInt },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            name: true,
            photoUrl: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json(messages);

  } catch (error) {
    console.error('Error obteniendo mensajes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Marcar mensajes como leídos
const markAsRead = async (req, res) => {
  try {
    const userId = req.userId;
    const { matchId } = req.params;
    const matchIdInt = parseInt(matchId);

    // Verificar que el match existe y el usuario es parte de él
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

    // Marcar como leídos todos los mensajes no leídos que fueron enviados al usuario actual
    await prisma.message.updateMany({
      where: {
        matchId: matchIdInt,
        receiverId: userId,
        readAt: null
      },
      data: {
        readAt: new Date()
      }
    });

    res.json({ message: 'Mensajes marcados como leídos' });

  } catch (error) {
    console.error('Error marcando mensajes como leídos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener conversaciones recientes
const getRecentConversations = async (req, res) => {
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
            name: true,
            photoUrl: true
          }
        },
        user2: {
          select: {
            id: true,
            username: true,
            name: true,
            photoUrl: true
          }
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Filtrar solo matches que tienen mensajes
    const conversations = matches
      .filter(match => match.messages.length > 0)
      .map(match => {
        const otherUser = match.user1Id === userId ? match.user2 : match.user1;
        const lastMessage = match.messages[0];

        return {
          matchId: match.id,
          user: otherUser,
          lastMessage: {
            content: lastMessage.content,
            createdAt: lastMessage.createdAt,
            isFromMe: lastMessage.senderId === userId,
            isRead: lastMessage.readAt !== null
          },
          updatedAt: lastMessage.createdAt
        };
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.json(conversations);

  } catch (error) {
    console.error('Error obteniendo conversaciones:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markAsRead,
  getRecentConversations
};