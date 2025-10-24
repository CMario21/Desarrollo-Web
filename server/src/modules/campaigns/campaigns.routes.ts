// server/src/modules/campaigns/campaigns.routes.ts
import { Router } from 'express'
import { prisma } from '../../prisma.js'
import { z } from 'zod'
import { authJwt, requireAdmin } from '../../middleware/authJwt.js'

const r = Router()

// Tipos locales para ayudar a TS
type GroupRow = { candidate_id: bigint; _count: { _all: number } }
type CandidateWithUser = {
  id: bigint
  user_id: bigint
  campaign_id: bigint
  bio: string | null
  created_at: Date
  user?: { nombre: string } | null
}

// GET /api/campaigns
r.get('/', async (_req, res) => {
  const items = await prisma.campaign.findMany({ orderBy: { id: 'desc' } })
  res.json(items)
})

// GET /api/campaigns/:id
r.get('/:id', async (req, res) => {
  const params = z.object({ id: z.string().regex(/^\d+$/) }).parse(req.params)
  const id = BigInt(params.id)

  const camp = await prisma.campaign.findUnique({
    where: { id },
    include: {
      candidates: {
        include: {
          user: { select: { nombre: true } },
        },
      },
    },
  })
  if (!camp) return res.status(404).json({ message: 'No encontrada' })

  // ❌ NO anotar aquí como GroupRow[] en la variable; eso rompe la inferencia del parámetro
  const grouped = await prisma.vote.groupBy({
    by: ['candidate_id'] as const,
    where: { campaign_id: id },
    _count: { _all: true },
  })
  // ✅ si quieres tipo explícito, cástalo al RESULTADO, no al parámetro:
  const agg = grouped as GroupRow[]

  const results = camp.candidates.map((c: CandidateWithUser) => ({
    candidateId: c.id,
    nombre: c.user?.nombre ?? '',
    votos: (agg.find((a: GroupRow) => a.candidate_id === c.id)?._count._all) ?? 0,
    bio: c.bio ?? null,
  }))

  res.json({
    ...camp,
    candidates: results,
  })
})

// POST /api/campaigns (solo admin)
r.post('/', authJwt, requireAdmin, async (req, res) => {
  const dto = z.object({
    titulo: z.string().min(1),
    descripcion: z.string().optional(),
    fecha_inicio: z.string().optional(),   // ISO string
    fecha_fin: z.string().optional(),      // ISO string
    votes_per_user: z.number().int().min(1),
    allow_duplicate_candidate_votes: z.boolean().optional()
  })
  const body = dto.parse(req.body)

  const item = await prisma.campaign.create({
    data: {
      titulo: body.titulo,
      descripcion: body.descripcion ?? null,
      fecha_inicio: body.fecha_inicio ? new Date(body.fecha_inicio) : null,
      fecha_fin: body.fecha_fin ? new Date(body.fecha_fin) : null,
      votes_per_user: body.votes_per_user,
      allow_duplicate_candidate_votes: body.allow_duplicate_candidate_votes ?? false,
      estado: 'disabled',
    }
  })
  res.status(201).json(item)
})

// (opcional) PATCH /api/campaigns/:id (solo admin)
r.patch('/:id', authJwt, requireAdmin, async (req, res) => {
  const params = z.object({ id: z.string().regex(/^\d+$/) }).parse(req.params)
  const id = BigInt(params.id)

  const dto = z.object({
    titulo: z.string().optional(),
    descripcion: z.string().optional(),
    estado: z.enum(['enabled','disabled','closed']).optional(),
    fecha_inicio: z.string().optional(),
    fecha_fin: z.string().optional(),
    votes_per_user: z.number().int().min(1).optional(),
    allow_duplicate_candidate_votes: z.boolean().optional()
  })
  const b = dto.parse(req.body)

  const item = await prisma.campaign.update({
    where: { id },
    data: {
      ...('titulo' in b ? { titulo: b.titulo! } : {}),
      ...('descripcion' in b ? { descripcion: b.descripcion! } : {}),
      ...('estado' in b ? { estado: b.estado! } : {}),
      ...('fecha_inicio' in b ? { fecha_inicio: b.fecha_inicio ? new Date(b.fecha_inicio) : null } : {}),
      ...('fecha_fin' in b ? { fecha_fin: b.fecha_fin ? new Date(b.fecha_fin) : null } : {}),
      ...('votes_per_user' in b ? { votes_per_user: b.votes_per_user! } : {}),
      ...('allow_duplicate_candidate_votes' in b ? { allow_duplicate_candidate_votes: b.allow_duplicate_candidate_votes! } : {}),
    }
  })
  res.json(item)
})

export default r