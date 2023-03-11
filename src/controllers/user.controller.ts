import { Request, Response } from "express";
import { UserRepository } from "../repositories";

export const getUsers = async (req: Request, res: Response) => {
    const users = await UserRepository.getList();
    res.json(users)
}