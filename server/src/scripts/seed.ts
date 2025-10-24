import 'dotenv/config';
import { prisma } from '../prisma.js';
import bcrypt from 'bcryptjs';
(async () => {
  const password_hash = await bcrypt.hash('Admin123!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { rol: 'admin', password_hash },
    create: {
      colegiado: 'A-000',
      dpi: '1234567890101',
      nombre: 'Admin',
      email: 'admin@example.com',
      fecha_nacimiento: new Date('1990-01-01'),
      rol: 'admin',
      password_hash
    }
  });
  console.log('Admin listo');
})();