import { Router } from 'express'
import { User } from '../controllers/user'
import checkJwt from '../utils/middlewares'

const router = Router()

router.get('/', [checkJwt], User.todos)

export default router
