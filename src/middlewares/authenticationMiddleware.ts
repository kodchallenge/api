import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../configs/jwt";

export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized',
        });
    }
    verifyToken(token, (err, user) => {
        console.log("ERR ", err)
        if (err) return res.status(403).json({ message: "Forbidden" });
        //@ts-ignore
        req.user = user;
        next();
    });
}