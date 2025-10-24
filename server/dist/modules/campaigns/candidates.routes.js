import { Router } from 'express';
import { prisma } from '../../prisma.js';
import { z } from 'zod';
import { authJwt, requireAdmin } from '../../middleware/authJwt.js';
const r = Router({ mergeParams: true });
// ✅ POST /api/campaigns/:campaignId/candidates (admin)
r.post('/', authJwt, requireAdmin, async (req, res) => {
    const dto = z.object({
        user_id: z.string().min(1),
        bio: z.string().optional(),
    });
    const body = dto.parse(req.body);
    const { campaignId } = req.params;
    const campaign_id = BigInt(campaignId);
    const user_id = BigInt(body.user_id);
    const [camp, user] = await Promise.all([
        prisma.campaign.findUnique({ where: { id: campaign_id } }),
        prisma.user.findUnique({ where: { id: user_id } }),
    ]);
    if (!camp)
        return res.status(404).json({ message: 'Campaña no encontrada' });
    if (!user)
        return res.status(404).json({ message: 'Usuario no encontrado' });
    try {
        const cc = await prisma.campaignCandidate.create({
            data: { campaign_id, user_id, bio: body.bio ?? null },
        });
        res.status(201).json(cc);
    }
    catch (e) {
        if (e.code === 'P2002') {
            return res.status(409).json({ message: 'Este usuario ya es candidato en esta campaña' });
        }
        throw e;
    }
});
// ✅ GET /api/campaigns/:campaignId/candidates  (público o admin)
r.get('/', async (req, res) => {
    const { campaignId } = req.params;
    const campaign_id = BigInt(campaignId);
    const items = await prisma.campaignCandidate.findMany({
        where: { campaign_id },
        include: { user: true },
        orderBy: { id: 'asc' },
    });
    const result = items.map((i) => ({
        id: i.id,
        user_id: i.user_id,
        nombre: i.user.nombre,
        colegiado: i.user.colegiado,
        dpi: i.user.dpi,
        email: i.user.email,
        bio: i.bio,
        created_at: i.created_at,
    }));
    res.json(result);
});
// DELETE /api/campaigns/:campaignId/candidates/:id  (admin)
r.delete('/:id', authJwt, requireAdmin, async (req, res) => {
    const { campaignId, id } = req.params;
    const campaign_id = BigInt(campaignId);
    const candidateId = BigInt(id);
    // Verifica que el candidato exista y pertenezca a la campaña
    const cc = await prisma.campaignCandidate.findFirst({
        where: { id: candidateId, campaign_id }
    });
    if (!cc)
        return res.status(404).json({ message: 'Candidato no encontrado en esta campaña' });
    // Borra votos relacionados y luego la asignación
    const [votesDeleted, candidateDeleted] = await prisma.$transaction([
        prisma.vote.deleteMany({ where: { candidate_id: candidateId } }),
        prisma.campaignCandidate.delete({ where: { id: candidateId } })
    ]);
    res.json({
        message: 'Candidato eliminado',
        candidateId: candidateDeleted.id.toString(),
        removedVotes: votesDeleted.count
    });
});
export default r;
