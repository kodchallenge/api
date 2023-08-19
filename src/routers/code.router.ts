import Router from "express-promise-router";
import { runCode } from "../controllers/code.controller";

const codeRouter = Router()
codeRouter.post("/run", runCode)

export default codeRouter