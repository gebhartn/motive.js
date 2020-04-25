import express, { Request, Response, NextFunction, Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import * as jwt from 'jsonwebtoken'
import config from './config'

type JsonError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => void

export const handleJsonError: JsonError = (err, _req, res, next) => {
  if (
    err instanceof SyntaxError &&
    (err as any).status === 400 &&
    'body' in err
  ) {
    return res.status(400).json({ err: (err as any).message })
  }
  next()
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

export const applyMiddleware = (server: Application) => {
  server.use(cors())
  server.use(helmet())
  server.use(express.json())
  server.use(handleJsonError)
}
