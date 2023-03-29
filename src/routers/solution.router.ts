import Router from "express-promise-router";
import { saveSolution } from "../controllers/solution.controller";
import { authenticationMiddleware } from "../middlewares/authenticationMiddleware";

const solutionRouter = Router()
solutionRouter.post("/", authenticationMiddleware, saveSolution)

export default solutionRouter