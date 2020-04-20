import { Router } from 'express'
import { User } from '../controllers/user'
import { Auth } from '../controllers/auth'

const router = Router()

router.post('/register', User.register)
router.post('/login', Auth.login)

export default router
