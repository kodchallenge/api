import express from 'express'
import { errorHandler } from '../middlewares/errorHandler'
import categoryRouter from './category.router'
import codeRouter from './code.router'
import problemRouter from './problem.router'
const router = express.Router()

router.use("/problems", problemRouter)
router.use("/categories", categoryRouter)
router.use("/code", codeRouter)

export default router;