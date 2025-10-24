import jwt from 'jsonwebtoken';
export function authJwt(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer '))
        return res.status(401).json({ message: 'No token' });
    try {
        const token = auth.slice(7);
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    }
    catch (e) {
        return res.status(401).json({ message: 'Token inválido' });
    }
}
export function requireAdmin(req, res, next) {
    const u = req.user;
    if (!u || u.rol !== 'admin')
        return res.status(403).json({ message: 'Solo administrador' });
    next();
}
