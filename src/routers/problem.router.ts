import Router from "express-promise-router";
import { getProblemById, getProblemByIdOrSlug, getProblems, saveProblemWithAllLangs } from '../controllers/problem.controller'

const problemRouter = Router()
problemRouter.get("/", getProblems)
problemRouter.post("/", saveProblemWithAllLangs)
problemRouter.get("/:id", getProblemByIdOrSlug)

export default problemRouter