import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../configs/jwt";
import { UserRepository } from "../repositories";

export const getUsers = async (req: Request, res: Response) => {
    const users = await UserRepository.getList();
    res.json(users)
}


export const getUserById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.id) // check if id is a number
        const user = await UserRepository.getById(userId)
        res.json(user)
    } catch(err) {
        next()
    }
}


export const getUserByUsername = async (req: Request<{ username: string }>, res: Response) => {
    const user = await UserRepository.getByUsername(req.params.username)
    res.json(user)
}