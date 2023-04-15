import { Request, Response } from "express";
import { generateToken } from "../configs/jwt";
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
    user.setDataValue("password", "")

    // return user and jwt token
    const jwtToken = generateToken(user);

    res.json({ ...user.dataValues, token: jwtToken })
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

export const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;
    const user = await UserRepository.getByRefreshToken(refreshToken);
    if (!user) {
        res.status(401).json({ message: "Token expired" })
        return;
    }
    user.setDataValue("password", "")
    // return user and jwt token
    const jwtToken = generateToken(user);
    res.json({ ...user.dataValues, token: jwtToken })
}