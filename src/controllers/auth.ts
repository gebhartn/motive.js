import { PrismaClient, User } from '@prisma/client'
import { Request, Response } from 'express'
import * as bcrypt from 'bcryptjs'
import signJwt from '../utils/signJwt'

const prisma = new PrismaClient()

export const AuthController = {
  //! =================================================
  //! Login as a valid user
  //!  Body:
  //!    username: String (reqired): username
  //!    password: String (reqired): password
  //! =================================================
  login: async (req: Request, res: Response) => {
    const { username, password } = req.body

    if (!(username && password)) {
      return res.status(400).json({ err: 'Must provide username and password' })
    }

    let user: User | null = null

    try {
      user = await prisma.user.findOne({ where: { username } })
    } catch (err) {
      return res.status(401).json({ err: 'That user does not exist' })
    }

    if (!(user && bcrypt.compareSync(password, user.password))) {
      return res.status(401).json({ err: 'Invalid password' })
    }

    const token = user && signJwt(user.id)

    res.status(200).json({ payload: token })
  },
}
