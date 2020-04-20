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
}
