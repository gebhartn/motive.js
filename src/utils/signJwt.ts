import * as jwt from 'jsonwebtoken'
import config from './config'

export default (id: any) => jwt.sign({ id }, config.secret, { expiresIn: '1h' })
