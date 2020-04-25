import { PrismaClient, Todo, UserWhereInput } from '@prisma/client'
import { Request, Response } from 'express'
import { wrap } from '../utils/middlewares'

const prisma = new PrismaClient()

export const TodoController = {
  //! =================================================
  //! Create a new Todo:
  //!   Body:
  //!    category: String (required): work, personal
  //!    content: String (required): take out trash
  //! =================================================
  createOne: wrap(async (req: Request, res: Response) => {
    const { id } = res.locals.payload
    const { category, content } = req.body

    const data = { content, category, author: { connect: { id } } }

    if (!(content && category))
      return res.status(400).json({ err: 'Must provide content and category' })

    let todo: Todo | null

    todo = await prisma.todo.create({ data })

    res.status(200).json({ todo })
  }),

  //! =================================================
  //! Find all todos for a user by id
  //! =================================================
  findAll: wrap(async (_req: Request, res: Response) => {
    const { id } = res.locals.payload
    const where = { id }
    const include = { todos: true }

    let user: UserWhereInput | null

    user = await prisma.user.findOne({ where, include })

    const todos = user?.todos

    res.status(200).json({ todos })
  }),

  //! =================================================
  //! Find a todo by query string
  //!
  //! If no query string is provided, return all todos
  //! =================================================
  filterMany: wrap(async (req: Request, res: Response) => {
    const { id } = res.locals.payload
    const { search }: { search?: string } = req.query
    const contains = { contains: search }
    const OR = [{ category: contains }, { content: contains }]
    const author = { id: Number(id) }

    let todos: Todo[] | null

    todos = await prisma.todo.findMany({ where: { author, OR } })

    if (!todos) return res.status(400).json({ err: 'No todos by that author' })

    res.status(200).json({ todos })
  }),

  //! =================================================
  //! Delete a todo by id
  //! =================================================
  deleteOne: wrap(async (req: Request, res: Response) => {
    const { id } = req.params
    const userId = res.locals.payload.id
    const where = { id: Number(id) }

    let todo: Todo | null
    let owner: Todo | null

    owner = await prisma.todo.findOne({ where })

    if (!(owner?.authorId === userId))
      return res
        .status(401)
        .json({ err: 'You are not the author of this todo' })

    todo = await prisma.todo.delete({ where })

    if (!todo) return res.status(401).json({ err: 'No todo with that ID' })

    res.status(200).json({ todo })
  }),

  updateOne: wrap(async (req: Request, res: Response) => {
    const { id } = req.params
    const { category, content } = req.body
    const where = { id: Number(id) }

    if (!(category && content))
      return res.status(400).json({ err: 'Must provide category and content' })

    let todo: Todo | null

    todo = await prisma.todo.findOne({ where })

    if (!todo)
      return res.status(400).json({ err: 'Todo with that id does not exist' })

    await prisma.todo.update({ where, data: { category, content } })

    res.status(204).send()
  }),
}
