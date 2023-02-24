import Router from "express-promise-router";
import { getProblemById, getProblemByIdOrSlug, getProblems } from '../controllers/problem.controller'

const problemRouter = Router()
problemRouter.get("/", getProblems)
problemRouter.get("/:id", getProblemByIdOrSlug)

export default problemRouter