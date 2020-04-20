import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import config from './config'

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  const token = <string>req.headers.authorization
  let payload: any

  try {
    payload = <any>jwt.verify(token, config.secret)
    res.locals.payload = payload
  } catch (why) {
    res.status(401).send()
    return
  }

  const { id, username } = payload
  const newToken = jwt.sign({ id, username }, config.secret, {
    expiresIn: '1h',
  })
  res.setHeader('token', newToken)

  next()
}
