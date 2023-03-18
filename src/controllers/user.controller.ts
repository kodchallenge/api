import { Request, Response } from "express";
import { verifyToken } from "../configs/jwt";
import { UserRepository } from "../repositories";

export const getUsers = async (req: Request, res: Response) => {
    const users = await UserRepository.getList();
    res.json(users)
}


export const getUserById = async (req: Request<{ id: number }>, res: Response) => {
    const user = await UserRepository.getById(req.params.id)
    res.json(user)
}