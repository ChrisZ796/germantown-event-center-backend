import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

interface JwtPayload {
    Id: number
    username: string
}

export interface AuthRequest extends Request {
    user?: JwtPayload
    headers: Request['headers']
}

export function authenticateToken(
    req: AuthRequest, res: Response, next: NextFunction
) {
    const authHeader = req.headers.authorization
    console.log('authenticateToken - Authorization header:', authHeader)
    const token = authHeader?.split(" ")[1]

    if (!token) {
        console.log('authenticateToken - no token provided')
        return res.status(401).json({
            message: "No token"
        })
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload
        req.user = decoded;
        next();
    }
    catch (err) {
        console.log('authenticateToken - token verification failed:', err instanceof Error ? err.message : err)
        res.status(403).json({
            message: "invalid or expired token",
            error: err instanceof Error ? err.message : String(err)
        })
    }
}