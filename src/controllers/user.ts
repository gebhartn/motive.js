import { PrismaClient, User } from '@prisma/client'
import { Request, Response } from 'express'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export const UserController = {
  //! =================================================
  //! Register a new user
  //!  Body:
  //!    username: String (reqired): unique username
  //!    password: String (reqired): password
  //! =================================================
  register: async (req: Request, res: Response) => {
    let { username, password } = req.body

    if (!(username && password)) {
      res.status(400).json({ err: 'Must provide username and password' })
    }

    password = bcrypt.hashSync(password, 8)

    let user: User

    try {
      user = await prisma.user.create({ data: { username, password } })
      delete user.password
    } catch (err) {
      res.status(500).json({ err: 'Could not create new user' })
    }

    res.status(201).json({ user })
  },

  //! =================================================
  //! Update password for existing user
  //!  Body:
  //!    oldPassword: String (required): current password
  //!    newPassword: String (required): new password
  //! =================================================
  updatePassword: async (req: Request, res: Response) => {
    const { id } = res.locals.payload

    const { oldPassword, newPassword } = req.body

    if (!(oldPassword && newPassword)) {
      res.status(400).send({ err: 'Must provide old and new passwords' })
    }

    let user: User

    const where = { id: Number(id) }

    try {
      user = await prisma.user.findOne({ where })
    } catch (id) {
      res.status(401).send({ err: 'User with that id does not exist' })
    }

    if (!bcrypt.compareSync(oldPassword, user.password)) {
      res.status(401).json({ err: 'Password was incorrect' })
    }

    if (bcrypt.compareSync(newPassword, user.password)) {
      res.status(401).json({ err: 'New password must be different' })
    }

    const password = bcrypt.hashSync(newPassword, 8)

    try {
      await prisma.user.update({ where, data: { password } })
    } catch (err) {
      res.status(500).json({ err: 'Failed to update password' })
    }

    res.status(204).send()
  },
}
