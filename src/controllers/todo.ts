import { PrismaClient, Todo, UserWhereInput } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const TodoController = {
  //! =================================================
  //! Create a new Todo:
  //!   Body:
  //!    category: String (required): work, personal
  //!    content: String (required): take out trash
  //! =================================================
  createOne: async (req: Request, res: Response) => {
    const { id } = res.locals.payload

    const { category, content } = req.body
    const data = { content, category, author: { connect: { id } } }

    if (!(content && category)) {
      return res.status(400).json({ err: 'Must provide content and category' })
    }

    let todo: Todo | null = null

    try {
      todo = await prisma.todo.create({ data })
    } catch (err) {
      return res.status(401).json({ err: 'Unable to create new todo' })
    }

    res.status(200).json({ todo })
  },

  //! =================================================
  //! Find all todos for a user by id
  //! =================================================
  findAll: async (_req: Request, res: Response) => {
    const { id } = res.locals.payload

    const where = { id: Number(id) }
    const include = { todos: true }

    let user: UserWhereInput | null = null

    try {
      user = await prisma.user.findOne({ where, include })
    } catch (err) {
      return res
        .status(401)
        .json({ err: 'You are not the author of this todo' })
    }

    const todos = user?.todos

    res.status(200).json({ todos })
  },

  //! =================================================
  //! Find a todo by query string
  //!
  //! If no query string is provided, return all todos
  //! =================================================
  filterMany: async (req: Request, res: Response) => {
    const { id } = res.locals.payload

    const { search }: { search?: string } = req.query
    const contains = { contains: search }
    const OR = [{ category: contains }, { content: contains }]
    const author = { id: Number(id) }

    let todos: Todo[] | null = null

    try {
      todos = await prisma.todo.findMany({ where: { author, OR } })
    } catch (err) {
      return res.status(500).json({ err: 'Error finding todos' })
    }

    if (!todos) {
      return res.status(400).json({ err: 'No todos by that author' })
    }

    res.status(200).json({ todos })
  },

  //! =================================================
  //! Delete a todo by id
  //! =================================================
  deleteOne: async (req: Request, res: Response) => {
    const { id } = req.params

    const userId = res.locals.payload.id

    const where = { id: Number(id) }

    let todo: Todo | null = null
    let owner: Todo | null = null

    try {
      owner = await prisma.todo.findOne({ where })
    } catch (err) {
      return res.status(500).json({ err: 'Problem finding todo' })
    }

    if (!(owner?.authorId === userId)) {
      return res
        .status(401)
        .json({ err: 'You are not the author of this todo' })
    }

    try {
      todo = await prisma.todo.delete({ where })
    } catch (err) {
      return res.status(500).json({ err: 'Problem deleting todo' })
    }

    if (!todo) {
      return res.status(401).json({ err: 'No todo with that ID' })
    }

    res.status(200).json({ todo })
  },

  updateOne: async (req: Request, res: Response) => {
    const { id } = req.params

    const { category, content } = req.body
    const where = { id: Number(id) }

    if (!(category && content)) {
      return res.status(400).json({ err: 'Must provide category and content' })
    }

    let todo: Todo | null = null

    try {
      todo = await prisma.todo.findOne({ where })
    } catch (err) {
      return res.status(500).json({ err: 'Failed to update todo' })
    }

    if (!todo) {
      return res.status(400).json({ err: 'Todo with that id does not exist' })
    }

    try {
      await prisma.todo.update({ where, data: { category, content } })
    } catch (err) {
      return res.status(500).json({ err: 'Failed to update todo' })
    }

    res.status(204).send()
  },
}
