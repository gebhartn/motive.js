import * as jwt from 'jsonwebtoken'
import config from './config'

export default (id: string | number): string =>
  jwt.sign({ id }, config.secret, { expiresIn: '1h' })
