const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes (opcional)
  await prisma.message.deleteMany();
  await prisma.match.deleteMany();
  await prisma.swipe.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Datos anteriores eliminados');

  // Contraseña común para todos los usuarios de prueba
  const password = '123456';
  const passwordHash = await bcrypt.hash(password, 10);

  // Crear usuarios de prueba
  const users = [
    {
      username: 'maria_garcia',
      email: 'maria@test.com',
      name: 'María García',
      age: 24,
      photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b0c44789?w=400',
      interests: JSON.stringify(['Música', 'Viajes', 'Yoga', 'Fotografía'])
    },
    {
      username: 'carlos_lopez',
      email: 'carlos@test.com',
      name: 'Carlos López',
      age: 28,
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      interests: JSON.stringify(['Deportes', 'Cine', 'Tecnología', 'Cocinar'])
    },
    {
      username: 'ana_rodriguez',
      email: 'ana@test.com',
      name: 'Ana Rodríguez',
      age: 26,
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
      interests: JSON.stringify(['Arte', 'Lectura', 'Senderismo', 'Café'])
    },
    {
      username: 'david_martinez',
      email: 'david@test.com',
      name: 'David Martínez',
      age: 30,
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      interests: JSON.stringify(['Música', 'Guitarra', 'Rock', 'Conciertos'])
    },
    {
      username: 'sofia_hernandez',
      email: 'sofia@test.com',
      name: 'Sofía Hernández',
      age: 23,
      photoUrl: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=400',
      interests: JSON.stringify(['Baile', 'Fitness', 'Moda', 'Viajes'])
    },
    {
      username: 'miguel_torres',
      email: 'miguel@test.com',
      name: 'Miguel Torres',
      age: 29,
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      interests: JSON.stringify(['Programación', 'Gaming', 'Anime', 'Pizza'])
    },
    {
      username: 'laura_jimenez',
      email: 'laura@test.com',
      name: 'Laura Jiménez',
      age: 25,
      photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
      interests: JSON.stringify(['Naturaleza', 'Ecología', 'Yoga', 'Vegano'])
    },
    {
      username: 'pablo_ruiz',
      email: 'pablo@test.com',
      name: 'Pablo Ruiz',
      age: 27,
      photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      interests: JSON.stringify(['Fútbol', 'Cerveza', 'Amigos', 'Playa'])
    },
    {
      username: 'carmen_morales',
      email: 'carmen@test.com',
      name: 'Carmen Morales',
      age: 31,
      photoUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400',
      interests: JSON.stringify(['Medicina', 'Voluntariado', 'Mascotas', 'Vino'])
    },
    {
      username: 'javier_santos',
      email: 'javier@test.com',
      name: 'Javier Santos',
      age: 26,
      photoUrl: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400',
      interests: JSON.stringify(['Arquitectura', 'Diseño', 'Café', 'Minimalismo'])
    }
  ];

  console.log('👥 Creando usuarios...');
  const createdUsers = [];

  for (const userData of users) {
    const user = await prisma.user.create({
      data: {
        ...userData,
        passwordHash
      }
    });
    createdUsers.push(user);
    console.log(`✅ Usuario creado: ${user.name} (@${user.username})`);
  }

  console.log('💕 Creando swipes y matches de ejemplo...');

  // Crear algunos swipes de ejemplo
  const swipeData = [
    // María (1) likes Carlos (2) - MATCH
    { userId: 1, targetId: 2, isLike: true },
    { userId: 2, targetId: 1, isLike: true }, // Recíproco = MATCH
    
    // Ana (3) likes David (4) - MATCH  
    { userId: 3, targetId: 4, isLike: true },
    { userId: 4, targetId: 3, isLike: true }, // Recíproco = MATCH
    
    // Sofía (5) likes Miguel (6) - NO MATCH (unilateral)
    { userId: 5, targetId: 6, isLike: true },
    { userId: 6, targetId: 5, isLike: false }, // No recíproco
    
    // Laura (7) likes Pablo (8) - PENDIENTE
    { userId: 7, targetId: 8, isLike: true },
    // Pablo aún no ha evaluado a Laura
    
    // Algunos dislikes
    { userId: 1, targetId: 3, isLike: false },
    { userId: 2, targetId: 4, isLike: false },
    { userId: 5, targetId: 7, isLike: false },
    { userId: 8, targetId: 9, isLike: false },
  ];

  for (const swipe of swipeData) {
    await prisma.swipe.create({ data: swipe });
  }

  console.log('🎯 Creando matches confirmados...');

  // Crear matches para los swipes recíprocos
  const matches = [
    { user1Id: 1, user2Id: 2 }, // María y Carlos
    { user1Id: 3, user2Id: 4 }, // Ana y David
  ];

  for (const match of matches) {
    await prisma.match.create({ data: match });
  }

  console.log('💬 Creando mensajes de ejemplo...');

  // Obtener los matches creados
  const createdMatches = await prisma.match.findMany();

  // Mensajes para el match María-Carlos
  const match1 = createdMatches.find(m => 
    (m.user1Id === 1 && m.user2Id === 2) || (m.user1Id === 2 && m.user2Id === 1)
  );

  if (match1) {
    const messages1 = [
      {
        matchId: match1.id,
        senderId: 1, // María
        receiverId: 2, // Carlos
        content: '¡Hola Carlos! Me gusta tu perfil 😊',
        createdAt: new Date(Date.now() - 86400000) // Hace 1 día
      },
      {
        matchId: match1.id,
        senderId: 2, // Carlos
        receiverId: 1, // María
        content: 'Hola María! Gracias, el tuyo también está genial. ¿Cómo estás?',
        createdAt: new Date(Date.now() - 82800000) // Hace 23 horas
      },
      {
        matchId: match1.id,
        senderId: 1, // María
        receiverId: 2, // Carlos
        content: 'Muy bien! Vi que te gusta la música. ¿Qué tipo escuchas?',
        createdAt: new Date(Date.now() - 79200000) // Hace 22 horas
      },
      {
        matchId: match1.id,
        senderId: 2, // Carlos
        receiverId: 1, // María
        content: 'Me gusta el rock y algo de electrónica. ¿Y tú?',
        createdAt: new Date(Date.now() - 3600000) // Hace 1 hora
      }
    ];

    for (const message of messages1) {
      await prisma.message.create({ data: message });
    }
  }

  // Mensajes para el match Ana-David
  const match2 = createdMatches.find(m => 
    (m.user1Id === 3 && m.user2Id === 4) || (m.user1Id === 4 && m.user2Id === 3)
  );

  if (match2) {
    const messages2 = [
      {
        matchId: match2.id,
        senderId: 3, // Ana
        receiverId: 4, // David
        content: '¡Hola! Vi que tocas guitarra, eso es genial 🎸',
        createdAt: new Date(Date.now() - 43200000) // Hace 12 horas
      },
      {
        matchId: match2.id,
        senderId: 4, // David
        receiverId: 3, // Ana
        content: '¡Hola Ana! Sí, me encanta tocar. ¿Tú también eres musical?',
        createdAt: new Date(Date.now() - 7200000) // Hace 2 horas
      }
    ];

    for (const message of messages2) {
      await prisma.message.create({ data: message });
    }
  }

  console.log('📊 Resumen del seed:');
  console.log(`👤 Usuarios creados: ${createdUsers.length}`);
  console.log(`💕 Swipes creados: ${swipeData.length}`);
  console.log(`🎯 Matches creados: ${matches.length}`);
  console.log(`💬 Mensajes creados: ${matches.length > 0 ? '6' : '0'}`);
  
  console.log('\n🔑 Credenciales de prueba:');
  console.log('📧 Email/Usuario: cualquier username de arriba');
  console.log('🔒 Contraseña: 123456 (para todos)');
  
  console.log('\n✨ Algunos usuarios para probar:');
  console.log('• maria_garcia / maria@test.com');
  console.log('• carlos_lopez / carlos@test.com');
  console.log('• ana_rodriguez / ana@test.com');
  
  console.log('\n🎉 ¡Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });