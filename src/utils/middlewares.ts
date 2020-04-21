import express, { Request, Response, NextFunction, Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import * as jwt from 'jsonwebtoken'
import config from './config'

export const applyMiddleware = (server: Application) => {
  server.use(cors())
  server.use(helmet())
  server.use(express.json())
}

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  const token: string = req.headers.authorization || ''
  let payload: any

  try {
    payload = jwt.verify(token, config.secret)
    res.locals.payload = payload
  } catch (err) {
    res.status(401).json({ err: 'A valid token is required' })
    return
  }

  const { id } = payload

  const newToken = jwt.sign({ id }, config.secret, { expiresIn: '1h' })

  res.setHeader('token', newToken)

  next()
}
