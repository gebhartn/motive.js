import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const Todo = {
  create: async (req: Request, res: Response) => {
    const { id } = res.locals.payload
    const { category, content } = req.body

    const todo = await prisma.todo.create({
      data: { content, category, author: { connect: { id } } },
    })

    res.status(200).json(todo)
  },
}
