import { Router } from 'express'
import auth from './auth'
import todo from './todo'

const routes = Router()

routes.use('/auth', auth)
routes.use('/todo', todo)

export default routes
