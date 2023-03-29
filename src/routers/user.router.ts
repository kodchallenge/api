import Router from "express-promise-router";
import { getUserById, getUserByUsername, getUsers } from "../controllers/user.controller";

const userRouter = Router()
userRouter.get("/", getUsers)
userRouter.get("/:id", getUserById)
userRouter.get("/:username", getUserByUsername)

export default userRouter