import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


export interface TokenPayload { id: bigint; rol: 'admin' | 'voter'; }


export function authJwt(req: Request, res: Response, next: NextFunction){
const auth = req.headers.authorization;
if(!auth?.startsWith('Bearer ')) return res.status(401).json({ message: 'No token' });
try{
const token = auth.slice(7);
const payload = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
(req as any).user = payload;
next();
}catch(e){
return res.status(401).json({ message: 'Token inválido' });
}
}


export function requireAdmin(req: Request, res: Response, next: NextFunction){
const u = (req as any).user as TokenPayload | undefined;
if(!u || u.rol !== 'admin') return res.status(403).json({ message: 'Solo administrador' });
next();
}