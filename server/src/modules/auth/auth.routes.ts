import { Router } from 'express';
import { prisma } from '../../prisma.js';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { hashPassword, comparePassword } from '../../utils/hash.js';
import { authJwt, requireAdmin } from '../../middleware/authJwt.js';

const r = Router();

const registerDto = z.object({
  colegiado: z.string().min(1),
  dpi: z.string().min(6),
  nombre: z.string().min(1),
  email: z.string().email(),
  fecha_nacimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  password: z.string().min(6),
});

r.post('/register', async (req, res) => {
  const body = registerDto.parse(req.body);
  const exists = await prisma.user.findFirst({
    where: {
      OR: [{ colegiado: body.colegiado }, { dpi: body.dpi }, { email: body.email }],
    },
  });
  if (exists) return res.status(409).json({ message: 'Usuario ya existe' });

  const password_hash = await hashPassword(body.password);
  const user = await prisma.user.create({
    data: {
      colegiado: body.colegiado,
      dpi: body.dpi,
      nombre: body.nombre,
      email: body.email,
      fecha_nacimiento: new Date(body.fecha_nacimiento),
      rol: 'voter',
      password_hash,
    },
  });

  res.status(201).json({
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
    },
  });
});

r.post('/login', async (req, res) => {
  const schema = z.object({
    colegiado: z.string().min(1),
    dpi: z.string().min(6),
    password: z.string().min(6),
  });

  const { colegiado, dpi, password } = schema.parse(req.body);

  // Busca un único usuario que cumpla ambas credenciales
  const user = await prisma.user.findFirst({
    where: { colegiado, dpi },
  });

  // Mensaje genérico para no filtrar qué falló
  if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

  // (Opcional) verificar estado si tu esquema lo tiene
  if ((user as any).estado && (user as any).estado !== 'active') {
    return res.status(403).json({ message: 'Usuario bloqueado o inactivo' });
  }

  const ok = await comparePassword(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' });

  // Importante: firmar id como string (BigInt no es JSON-serializable)
  const token = jwt.sign(
    { id: String(user.id), rol: user.rol },
    process.env.JWT_SECRET as string,
    { expiresIn: '1d' },
  );

  res.json({
    token,
    user: { id: String(user.id), nombre: user.nombre, email: user.email, rol: user.rol },
  });
});

// Tipo local para el listado (coincide con el select de findMany)
type UserListItem = {
  id: number | bigint;
  nombre: string | null;
  colegiado: string;
  dpi: string;
  email: string;
  rol: string; // o 'admin' | 'voter' si lo tienes así en tu schema
};

// GET /api/auth/users?voter=true | ?role=voter | ?q=texto
// Solo admin: lista usuarios (por defecto votantes si ?voter=true)
r.get('/users', authJwt, requireAdmin, async (req, res) => {
  // valida querystring
  const qschema = z.object({
    voter: z.string().optional(), // "true" si se quiere solo votantes
    role: z.enum(['admin', 'voter']).optional(),
    q: z.string().optional(), // búsqueda rápida por nombre/colegiado/dpi/email
    limit: z.coerce.number().min(1).max(100).optional().default(50),
  });
  const { voter, role, q, limit } = qschema.parse(req.query);

  const where: any = {};
  if (voter === 'true') where.rol = 'voter';
  if (role) where.rol = role;
  if (q && q.trim()) {
    where.OR = [
      { nombre: { contains: q, mode: 'insensitive' } },
      { colegiado: { contains: q, mode: 'insensitive' } },
      { dpi: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { id: 'asc' },
    take: limit,
    select: {
      id: true,
      nombre: true,
      colegiado: true,
      dpi: true,
      email: true,
      rol: true,
    },
  });

  // BigInt -> string (si tu Prisma devuelve BigInt)
  const items = (users as UserListItem[]).map((u) => ({
    ...u,
    id: typeof u.id === 'bigint' ? u.id.toString() : u.id,
  }));

  res.json(items);
});

r.get('/me', authJwt, async (req, res) => {
  const u = (req as any).user as { id: bigint };
  const user = await prisma.user.findUnique({ where: { id: u.id } });
  if (!user) return res.status(404).json({ message: 'No encontrado' });
  res.json({ user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } });
});

export default r;