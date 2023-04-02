import Router from "express-promise-router";
import { getUserById, getUserByUsername, getUsers } from "../controllers/user.controller";
import { getApprovedSolutionsByUserId } from "../controllers/solution.controller";
import { authenticationMiddleware } from "../middlewares/authenticationMiddleware";

const userRouter = Router()
userRouter.get("/", getUsers)
userRouter.get("/:id", getUserById)
userRouter.get("/:username", getUserByUsername)

userRouter.get("/:id/solutions", authenticationMiddleware, getApprovedSolutionsByUserId)

export default userRouter