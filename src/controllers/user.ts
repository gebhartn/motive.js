import { PrismaClient, User } from '@prisma/client'
import { Request, Response } from 'express'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export const UserController = {
  //! Register a new user
  //!  Body:
  //!    username: String (reqired): unique username
  //!    password: String (reqired): password
  register: async (req: Request, res: Response) => {
    const { username, password } = req.body
    const hashed = bcrypt.hashSync(password, 8)

    const { id } = await prisma.user.create({
      data: {
        username,
        password: hashed,
      },
    })

    res.status(201).json({ id })
  },

  //! Update password for existing user
  //!  Body:
  //!    oldPassword: String (required): previous password
  //!    newPassword: String (required): cannot be the same password
  updatePassword: async (req: Request, res: Response) => {
    const { id } = res.locals.payload
    const { oldPassword, newPassword } = req.body

    if (!(oldPassword && newPassword)) {
      res.status(400).send()
    }

    let user: User

    try {
      user = await prisma.user.findOne({ where: { id: Number(id) } })
    } catch (id) {
      res.status(401).send()
    }

    if (user && bcrypt.compareSync(oldPassword, user.password)) {
      res.status(401).json({ err: 'Password must be different' })
    }

    const hashed = bcrypt.hashSync(newPassword, 8)

    await prisma.user.update({
      where: { id: Number(id) },
      data: { password: hashed },
    })

    res.status(204).send()
  },
}
