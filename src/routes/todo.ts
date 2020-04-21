import { Router } from 'express'
import { TodoController } from '../controllers/todo'
import checkJwt from '../utils/middlewares'

const router = Router()

router.get('/', [checkJwt], TodoController.findAll)
router.post('/', [checkJwt], TodoController.create)
router.delete('/:id', [checkJwt], TodoController.deleteBy)
router.get('/filter', [checkJwt], TodoController.filterBy)

export default router
