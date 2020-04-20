import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { getRepository } from 'typeorm'
import { validate } from 'class-validator'

import { User } from '../entities/User'
import config from '../utils/config'

export class AuthController {
  static login = async (req: Request, res: Response) => {
    const { username, password } = req.body

    if (!(username && password)) {
      res.status(400).send()
    }

    let user: User
    const userRepository = getRepository(User)

    try {
      user = await userRepository.findOneOrFail({ where: { username } })
    } catch (err) {
      res.status(401).send()
    }

    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send()
      return
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      config.secret,
      { expiresIn: '1hr' }
    )

    res.send(token)
  }
}
