import * as express from 'express'
import * as cors from 'cors'
import * as helmet from 'helmet'
import routes from './routes'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

app.use('/', routes)

app.listen(3000, () => console.log(`Server has started on port 3000`))
