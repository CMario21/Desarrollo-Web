// prisma/seed.ts
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // crea/actualiza admin por defecto
  const password_hash = await bcrypt.hash('Admin123!', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { rol: 'admin', password_hash },
    create: {
      colegiado: 'A-001',
      dpi: '1234567890101',
      nombre: 'Admin',
      email: 'admin@example.com',
      fecha_nacimiento: new Date('1990-01-01'),
      rol: 'admin',
      password_hash
    }
  })

  console.log('✓ Admin listo:', admin.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
