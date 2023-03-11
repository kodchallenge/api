import Router from "express-promise-router";
import { getUsers } from "../controllers/user.controller";

const userRouter = Router()
userRouter.get("/", getUsers)

export default userRouter