import Router from "express-promise-router";
import { getUserById, getUsers } from "../controllers/user.controller";

const userRouter = Router()
userRouter.get("/", getUsers)
userRouter.get("/:id", getUserById)

export default userRouter