import { Router } from 'express'
import { Todo } from '../controllers/todo'
import checkJwt from '../utils/middlewares'

const router = Router()

router.get('/', [checkJwt], Todo.findAll)
router.post('/', [checkJwt], Todo.create)
router.delete('/:id', [checkJwt], Todo.deleteBy)
router.get('/filter', [checkJwt], Todo.filterBy)

export default router
