import { getRepository } from 'typeorm'
import { Request, Response } from 'express'
import { User } from '../entities/User'
import { validate } from 'class-validator'

export class UserController {
  static all = async (_req: Request, res: Response) => {
    const userRepository = getRepository(User)
    const users = await userRepository.find({
      select: ['id', 'username'],
    })

    res.send(users)
  }

  static oneById = async (req: Request, res: Response) => {
    const id: number | string = req.params.id

    const userRepository = getRepository(User)
    try {
      await userRepository.findOneOrFail(id, {
        select: ['id', 'username'],
      })
    } catch (err) {
      res.status(404).send('User not found')
    }
  }

  static create = async (req: Request, res: Response) => {
    const { username, password } = req.body
    const user = new User()
    user.username = username
    user.password = password

    const errors = await validate(user)
    if (errors.length) {
      res.status(400).send(errors)
      return
    }

    user.hashPassword()

    const userRepository = getRepository(User)

    try {
      await userRepository.save(user)
    } catch (err) {
      res.status(409).send('Username already in use')
      return
    }

    res.status(201).send('User created')
  }
}
