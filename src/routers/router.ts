import express from 'express'
import { errorHandler } from '../middlewares/errorHandler'
import authRouter from './auth.router'
import categoryRouter from './category.router'
import codeRouter from './code.router'
import problemRouter from './problem.router'
import userRouter from './user.router'
const router = express.Router()

router.use("/problems", problemRouter)
router.use("/categories", categoryRouter)
router.use("/code", codeRouter)
router.use("/users", userRouter)
router.use("/auth", authRouter)

export default router;