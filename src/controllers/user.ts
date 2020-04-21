import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export const User = {
  register: async (req: Request, res: Response) => {
    const { username, password } = req.body
    const hashed = bcrypt.hashSync(password, 8)

    const { id, username: user, createdAt } = await prisma.user.create({
      data: {
        username,
        password: hashed,
      },
    })

    res.status(201).json({ id, user, createdAt })
  },

  updatePassword: async (req: Request, res: Response) => {
    const { id } = res.locals.payload
    const { oldPassword, newPassword } = req.body
    if (!(oldPassword && newPassword)) {
      res.status(400).send()
    }

    let user

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
