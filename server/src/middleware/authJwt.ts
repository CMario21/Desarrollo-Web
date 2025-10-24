import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

type Role = 'admin' | 'voter';

// Lo que realmente viene en el JWT (nosotros firmamos id como string)
type JWTPayload = { id: string | number | bigint; rol: Role };

// Extrae token desde Authorization: Bearer ... o x-access-token
function getToken(req: Request): string | null {
  const h = req.headers;
  // Authorization
  const auth = typeof h.authorization === 'string' ? h.authorization : (h['authorization'] as string | undefined);
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    return auth.slice(7).trim();
  }
  // Fallback: x-access-token
  const x = h['x-access-token'];
  if (typeof x === 'string' && x.trim()) return x.trim();
  return null;
}

export function authJwt(req: Request, res: Response, next: NextFunction) {
  const token = getToken(req);
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as JWTPayload;

    // Normaliza a bigint (nuestro schema usa BigInt)
    let idBig: bigint;
    try {
      // decoded.id puede ser string/number/bigint
      idBig = typeof decoded.id === 'bigint' ? decoded.id : BigInt(decoded.id as any);
    } catch {
      return res.status(401).json({ message: 'Token inválido' });
    }

    (req as any).user = { id: idBig, rol: decoded.rol as Role };
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const u = (req as any).user as { id: bigint; rol: Role } | undefined;
  if (!u) return res.status(401).json({ message: 'Unauthorized' });
  if (u.rol !== 'admin') return res.status(403).json({ message: 'Solo administrador' });
  next();
}