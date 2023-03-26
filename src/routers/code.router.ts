import Router from "express-promise-router";
import { runCode, runTestCases } from "../controllers/code.controller";

const codeRouter = Router()
codeRouter.post("/run", runCode)
codeRouter.post("/case", runTestCases)

export default codeRouter