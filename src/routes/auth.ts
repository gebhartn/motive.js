import { Router } from 'express'
import { User } from '../models/user'
import { Auth } from '../models/auth'

const router = Router()

router.post('/register', User.register)
router.post('/login', Auth.login)

export default router
