import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm'
import { Length } from 'class-validator'
import * as bcrypt from 'bcryptjs'

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Length(5, 20)
  username: string

  @Column()
  @Length(8, 100)
  password: string

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8)
  }

  checkIfUnencryptedPasswordIsValid(unencrypted: string) {
    return bcrypt.compareSync(unencrypted, this.password)
  }
}
