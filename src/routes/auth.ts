import { Router } from 'express'
import { UserController } from '../controllers/user'
import { AuthController } from '../controllers/auth'
import checkJwt from '../utils/middlewares'

const router = Router()

router.post('/register', UserController.register)
router.put('/update', [checkJwt], UserController.updatePassword)
router.post('/login', AuthController.login)

export default router
