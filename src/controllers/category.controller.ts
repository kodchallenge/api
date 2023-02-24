import { Request, Response } from "express";
import { CategoryRepository } from "../repositories";

export const getCategories = async (req: Request, res: Response) => {
    const categories = await CategoryRepository.getList()
    res.json(categories)
}

export const getCategoryById = async (req: Request<{id: number}>, res: Response) => {
    const {id} = req.params
    const category = await CategoryRepository.getById(id)
    res.json(category)
}