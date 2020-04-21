import { PrismaClient, User } from '@prisma/client'
import { Request, Response } from 'express'
import * as bcrypt from 'bcryptjs'
import signJwt from '../utils/signJwt'

const prisma = new PrismaClient()

export const AuthController = {
  //! Login as a valid user
  //!  Body:
  //!    username: String (reqired): unique username
  //!    password: String (reqired): password

  login: async (req: Request, res: Response) => {
    const { username, password } = req.body

    if (!(username && password)) {
      res.status(400).send({ err: 'Must provide username and password' })
    }

    let user: User

    try {
      user = await prisma.user.findOne({ where: { username } })
    } catch (err) {
      res.status(401).send({ err: 'That user does not exist' })
    }

    if (!(user && bcrypt.compareSync(password, user.password))) {
      res.status(401).send({ err: 'Invalid password' })
    }

    const token = signJwt(user.id)

    res.status(200).json({ payload: token })
  },
}
