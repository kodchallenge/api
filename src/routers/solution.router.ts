import Router from "express-promise-router";
import { approveSolution, saveSolution } from "../controllers/solution.controller";
import { authenticationMiddleware } from "../middlewares/authenticationMiddleware";

const solutionRouter = Router()
solutionRouter.post("/", authenticationMiddleware, saveSolution)
solutionRouter.post("/:id", authenticationMiddleware, approveSolution)

export default solutionRouter