import { Request, Response } from "express";
import { UserRepository } from "../repositories";
import { User } from "../types";

export const signin = async (req: Request, res: Response) => {
    const { email, password } = req.body as { email: string, password: string };
    const user = await UserRepository.getByEmail(email);
    if (!user) {
        res.status(404).json({ message: "User not found" })
        return;
    }
    // @ts-ignore
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        res.status(401).json({ message: "Wrong password" })
        return;
    }
    res.json(user)
}

export const signup = async (req: Request, res: Response) => {
    const { 
        email, 
        password, 
        username,
        firstname,
        lastname,
    } = req.body as User
    const user = await UserRepository.create({
        email,
        password,
        username,
        firstname,
        lastname,
        createdAt: new Date(),
        deletedAt: null,
        verifiedAt: null,
        isVerified: false,
        isDeleted: false,
    });
    res.json(user)
}