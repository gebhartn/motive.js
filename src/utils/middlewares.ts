import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import config from './config'

export default (req: Request, res: Response, next: NextFunction) => {
  const token = <string>req.headers.authorization
  let payload

  try {
    payload = <any>jwt.verify(token, config.secret)
    res.locals.payload = payload
  } catch (err) {
    res.status(401).send()
    return
  }

  const { id } = payload
  const newToken = jwt.sign({ id }, config.secret, { expiresIn: '1h' })
  res.setHeader('token', newToken)

  next()
}
