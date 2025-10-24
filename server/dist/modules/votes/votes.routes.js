import { Router } from 'express';
import { z } from 'zod';
import { authJwt } from '../../middleware/authJwt.js';
import { castVote } from './votes.service.js';
const r = Router({ mergeParams: true });
r.post('/', authJwt, async (req, res) => {
    const { id } = req.params; // campaignId
    const body = z.object({ candidateId: z.string() }).parse(req.body);
    const user = req.user;
    try {
        const vote = await castVote(BigInt(user.id), BigInt(id), BigInt(body.candidateId));
        res.status(201).json({ message: 'Voto registrado', voteId: vote.id });
    }
    catch (e) {
        res.status(400).json({ message: e.message || 'No se pudo votar' });
    }
});
export default r;
