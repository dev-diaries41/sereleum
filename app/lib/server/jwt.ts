
'use server'
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

type TokenizedUrl = `${string}?token=${string}`;

const SECRET_KEY = process.env.ACCESS_SECRET || 'your-secret-key'; 

export async function generateAccessUrl(payload: Record<string, string>, baseUrl:string, options: SignOptions = { expiresIn:'1h' }) {
    const token = jwt.sign(payload, SECRET_KEY, options);
    return `${baseUrl}?token=${token}`;
}

export async function verifyToken<T extends JwtPayload = Record<string, any>>(token: string) {
    return jwt.verify(token, SECRET_KEY) as T
}

