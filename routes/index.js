import express from 'express'
import itemRouter from './itemRouter.js'

const router = express.Router()

router.use('/items', itemRouter);

export default router;