import { Router } from 'express'
import { Todo } from '../controllers/todo'
import checkJwt from '../utils/middlewares'

const router = Router()

router.post('/', [checkJwt], Todo.create)

export default router
