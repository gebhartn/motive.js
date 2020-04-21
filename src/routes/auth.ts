import { Router } from 'express'
import { User } from '../controllers/user'
import { Auth } from '../controllers/auth'
import checkJwt from '../utils/middlewares'

const router = Router()

router.post('/register', User.register)
router.put('/update', [checkJwt], User.updatePassword)
router.post('/login', Auth.login)

export default router
