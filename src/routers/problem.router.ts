import Router from "express-promise-router";
import { getProblemById, getProblemByIdOrSlug, getProblems, saveProblemWithAllLangs } from '../controllers/problem.controller'
import { getProblemSolutionsByUserId } from "../controllers/solution.controller";

const problemRouter = Router()
problemRouter.get("/", getProblems)
problemRouter.post("/", saveProblemWithAllLangs)
problemRouter.get("/:id", getProblemByIdOrSlug)
problemRouter.get("/:id/users/:userId/solutions", getProblemSolutionsByUserId)

export default problemRouter