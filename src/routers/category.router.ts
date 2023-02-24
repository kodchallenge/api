import Router from "express-promise-router";
import { getCategories, getCategoryById } from '../controllers/category.controller'

const categoryRouter = Router()
categoryRouter.get("/", getCategories)
categoryRouter.get("/:id", getCategoryById)

export default categoryRouter