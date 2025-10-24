import { prisma } from '../../prisma.js';
import type { Prisma } from '@prisma/client';   // 👈 importa el tipo

export async function castVote(userId: bigint, campaignId: bigint, candidateId: bigint){
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {  // 👈 tipa tx
    const camp = await tx.campaign.findUnique({ where: { id: campaignId } });
    if(!camp) throw new Error('Campaña no encontrada');
    if(camp.estado !== 'enabled') throw new Error('Campaña no habilitada');

    const now = new Date();
    if(camp.fecha_inicio && now < camp.fecha_inicio) throw new Error('Aún no inicia');
    if(camp.fecha_fin && now > camp.fecha_fin) throw new Error('Campaña finalizada');

    if(!camp.allow_duplicate_candidate_votes){
      const dup = await tx.vote.findFirst({ where: { user_id: userId, campaign_id: campaignId, candidate_id: candidateId } });
      if(dup) throw new Error('Ya votaste por este candidato');
    }

    const count = await tx.vote.count({ where: { user_id: userId, campaign_id: campaignId } });
    if(count >= camp.votes_per_user) throw new Error('Límite de votos alcanzado');

    return tx.vote.create({ data: { user_id: userId, campaign_id: campaignId, candidate_id: candidateId } });
  });
}
