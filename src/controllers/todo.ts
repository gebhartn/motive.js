import { PrismaClient, Todo, User, UserWhereInput } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const TodoController = {
  //! =================================================
  //! Create a new Todo:
  //!   Body:
  //!    category: String (required): work, personal
  //!    content: String (required): take out trash
  //! =================================================
  create: async (req: Request, res: Response) => {
    const { id } = res.locals.payload
    const { category, content } = req.body

    if (!(content && category)) {
      res.status(400).json({ err: 'Must provide content and category' })
    }

    let todo: Todo

    try {
      const data = { content, category, author: { connect: { id } } }
      todo = await prisma.todo.create({ data })
    } catch (err) {
      res.status(401).json({ err: 'Unable to create new todo' })
    }

    res.status(200).json({ todo })
  },

  //! =================================================
  //! Find all todos for a user by id
  //! =================================================
  findAll: async (_req: Request, res: Response) => {
    const { id } = res.locals.payload

    let user: UserWhereInput

    try {
      const where = { id: Number(id) }
      const include = { todos: true }
      user = await prisma.user.findOne({ where, include })
    } catch (err) {
      res.status(401).send()
    }

    const { todos } = user

    res.status(200).json({ todos })
  },

  //! =================================================
  //! Find a todo by query string
  //!
  //! If no query string is provided, return all todos
  //! =================================================
  filterBy: async (req: Request, res: Response) => {
    const { id } = res.locals.payload

    const { search }: { search?: string } = req.query

    let todos: Todo[]

    try {
      const contains = { contains: search }
      const OR = [{ category: contains }, { content: contains }]
      const author = { id: Number(id) }
      todos = await prisma.todo.findMany({ where: { author, OR } })
    } catch (err) {
      res.status(401).json({ err: 'No todos by that author' })
    }

    res.status(200).json({ todos })
  },

  //! =================================================
  //! Delete a todo by id
  //! =================================================
  deleteBy: async (req: Request, res: Response) => {
    const { id } = req.params

    let todo: Todo

    try {
      const where = { id: Number(id) }
      todo = await prisma.todo.delete({ where })
    } catch (err) {
      res.status(401).json({ err: 'No todo with that ID' })
    }

    res.status(202).json({ todo })
  },
}
