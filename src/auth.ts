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
    const token = authHeader?.split(" ")[1]

    if (!token) {
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
        res.status(403).json({
            message: "invalid or expired token",
            error: err
        })
    }
}