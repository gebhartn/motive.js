import express from 'express'
import routes from './routes'
import { applyMiddleware } from './utils/middlewares'

const port: number | string = process.env.PORT || 8000

const app = express()

applyMiddleware(app)

app.use('/', routes)

app.listen(port, () => console.log(`Server has started on port ${port}`))
