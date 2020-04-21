import { Router } from 'express'
import { TodoController } from '../controllers/todo'
import { checkJwt } from '../utils/middlewares'

const router = Router()

router.get('/', [checkJwt], TodoController.findAll)
router.post('/', [checkJwt], TodoController.createOne)
router.put('/:id', [checkJwt], TodoController.updateOne)
router.delete('/:id', [checkJwt], TodoController.deleteOne)
router.get('/filter', [checkJwt], TodoController.filterMany)

export default router
