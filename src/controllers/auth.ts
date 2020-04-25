import { PrismaClient, User } from '@prisma/client'
import { Request, Response } from 'express'
import * as bcrypt from 'bcryptjs'
import signJwt from '../utils/signJwt'
import { wrap } from '../utils/middlewares'

const prisma = new PrismaClient()

export const AuthController = {
  //! =================================================
  //! Login as a valid user
  //! =================================================
  login: wrap(async (req: Request, res: Response) => {
    const { username, password } = req.body

    if (!(username && password))
      return res.status(400).json({ err: 'Must provide username and password' })

    let user: User | null

    user = await prisma.user.findOne({ where: { username } })

    if (!user) return res.status(400).json({ err: 'Invalid username' })

    if (!bcrypt.compareSync(password, user.password))
      return res.status(401).json({ err: 'Invalid password' })

    const token = user && signJwt(user.id)

    res.status(200).json({ payload: token })
  }),
}
