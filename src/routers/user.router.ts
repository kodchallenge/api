import Router from "express-promise-router";
import { getUserById, getUsers } from "../controllers/user.controller";
import { authenticationMiddleware } from "../middlewares/authenticationMiddleware";

const userRouter = Router()
userRouter.get("/", getUsers)
userRouter.get("/:id", authenticationMiddleware, getUserById)

export default userRouter