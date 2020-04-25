import { PrismaClient, User } from '@prisma/client'
import { Request, Response } from 'express'
import * as bcrypt from 'bcryptjs'

import { wrap } from '../utils/middlewares'

const prisma = new PrismaClient()

export const UserController = {
  //! =================================================
  //! Register a new user
  //! =================================================
  register: wrap(async (req: Request, res: Response) => {
    let { username, password } = req.body

    if (!(username && password))
      return res.status(400).json({ err: 'Must provide username and password' })

    password = bcrypt.hashSync(password, 8)

    let user: User | null

    user = await prisma.user.findOne({ where: { username } })

    if (user)
      return res.status(400).json({ err: 'A user by that name already exists' })

    user = await prisma.user.create({ data: { username, password } })
    delete user.password

    res.status(201).json({ user })
  }),

  //! =================================================
  //! Update password for existing user
  //! =================================================
  updatePassword: wrap(async (req: Request, res: Response) => {
    const where = { id: Number(res.locals.payload.id) }
    const { oldPassword, newPassword } = req.body

    if (!(oldPassword && newPassword))
      return res.status(400).json({ err: 'Must provide old and new passwords' })

    let user: User | null

    user = await prisma.user.findOne({ where })

    if (!user)
      return res.status(400).json({ err: 'User with that id does not exist' })

    if (!bcrypt.compareSync(oldPassword, user.password))
      return res.status(401).json({ err: 'Password was incorrect' })

    if (bcrypt.compareSync(newPassword, user.password))
      return res.status(400).json({ err: 'New password must be different' })

    const password = bcrypt.hashSync(newPassword, 8)

    user = await prisma.user.update({ where, data: { password } })
    delete user.password

    res.status(200).send({ user })
  }),
}
