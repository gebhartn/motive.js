import { PrismaClient, User, UserWhereInput } from '@prisma/client'
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
      return res.status(400).json({ err: 'Must provide username and password' })
    }

    password = bcrypt.hashSync(password, 8)

    let user: User | null = null

    try {
      user = await prisma.user.findOne({ where: { username } })
    } catch (err) {
      return res.status(500).json({ err: 'Failed to look up user' })
    }

    if (user) {
      res.status(400).json({ err: 'A user by that name already exists' })
    }

    try {
      user = await prisma.user.create({ data: { username, password } })
      delete user.password
    } catch (err) {
      return res.status(500).json({ err: 'Could not create new user' })
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
    const where = { id: Number(id) }

    if (!(oldPassword && newPassword)) {
      return res.status(400).json({ err: 'Must provide old and new passwords' })
    }

    let user: User | null = null

    try {
      user = await prisma.user.findOne({ where })
    } catch (err) {
      return res.status(500).json({ err: 'Failed to look up user' })
    }

    if (!user) {
      return res.status(401).json({ err: 'User with that id does not exist' })
    }

    if (user && !bcrypt.compareSync(oldPassword, user.password)) {
      return res.status(401).json({ err: 'Password was incorrect' })
    }

    if (user && bcrypt.compareSync(newPassword, user.password)) {
      return res.status(401).json({ err: 'New password must be different' })
    }

    const password = bcrypt.hashSync(newPassword, 8)

    try {
      await prisma.user.update({ where, data: { password } })
    } catch (err) {
      return res.status(500).json({ err: 'Failed to update password' })
    }

    res.status(204).send()
  },
}
