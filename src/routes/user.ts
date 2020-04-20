import { Router } from 'express'
import { UserController } from '../controllers/UserController'
import { checkJwt } from '../utils/middlewares'

const router = Router()

router.get('/', [checkJwt], UserController.all)
router.get('/:id([0-9]+)', [checkJwt], UserController.oneById)
router.post('/', UserController.create)

export default router
