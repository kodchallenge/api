import Router from "express-promise-router";
import { signin, signup } from "../controllers/auth.controller";

const authRouter = Router()
authRouter.post("/signin", signin)
authRouter.post("/signup", signup)

export default authRouter