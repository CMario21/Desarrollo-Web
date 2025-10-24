// server/src/server.ts
import 'dotenv/config';
import app from './app.js';
import { prisma } from './prisma.js';
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no está definido en .env o variables de entorno');
}
const PORT = Number(process.env.PORT || 4000);
async function main() {
    await prisma.$queryRaw `SELECT 1`;
    console.log('DB conectada');
    app.listen(PORT, '0.0.0.0', () => console.log(`API escuchando en :${PORT}`));
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
