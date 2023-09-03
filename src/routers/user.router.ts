import Router from "express-promise-router";
import { getUserById, getUserByUsername, getUsers } from "../controllers/user.controller";
import { getApprovedSolutionsByUserId } from "../controllers/solution.controller";
import { authenticationMiddleware } from "../middlewares/authenticationMiddleware";

const userRouter = Router()
userRouter.get("/", authenticationMiddleware, getUsers)
userRouter.get("/:id", authenticationMiddleware, getUserById)
userRouter.get("/:username", authenticationMiddleware, getUserByUsername)

userRouter.get("/:id/solutions", authenticationMiddleware, getApprovedSolutionsByUserId)

export default userRouter