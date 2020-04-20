import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import * as bcrypt from 'bcryptjs'
import signJwt from '../utils/signJwt'

const prisma = new PrismaClient()

export const Auth = {
  login: async (req: Request, res: Response) => {
    const { username, password } = req.body
    let user

    if (!(username && password)) {
      res.status(400).send()
    }

    try {
      user = await prisma.user.findOne({ where: { username } })
    } catch (err) {
      res.status(401).send()
    }

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = signJwt(user.id)
      res.status(200).json({ payload: token })
    } else {
      res.status(401).send()
    }
  },
}
