import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const Todo = {
  //! Create a new Todo:
  //!   Body:
  //!    category: String (required): Ex. work, personal
  //!    content: String (required): Ex. update documentation
  create: async (req: Request, res: Response) => {
    const { id } = res.locals.payload
    const { category, content } = req.body

    const todo = await prisma.todo.create({
      data: { content, category, author: { connect: { id } } },
    })

    res.status(200).json(todo)
  },

  //! Find all todos for a user by id
  findAll: async (_req: Request, res: Response) => {
    const { id } = res.locals.payload
    const { todos } = await prisma.user.findOne({
      where: { id: Number(id) },
      include: { todos: true },
    })

    res.status(200).json({ todos })
  },

  //! Find a todo by query string
  //! Usage:
  //!    /filter?search={search-string}
  filterBy: async (req: Request, res: Response) => {
    const { search }: { search?: string } = req.query
    const { id } = res.locals.payload
    const result = await prisma.todo.findMany({
      where: {
        author: { id: Number(id) },
        OR: [
          { category: { contains: search } },
          { content: { contains: search } },
        ],
      },
    })

    res.status(200).json(result)
  },

  //! Delete a todo by id
  deleteBy: async (req: Request, res: Response) => {
    const { id } = req.params
    const todo = await prisma.todo.delete({
      where: { id: Number(id) },
    })

    res.status(202).json(todo)
  },
}
