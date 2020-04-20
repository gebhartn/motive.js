interface Config {
  secret: string
}

export default { secret: process.env.SECRET || 'Secret' } as Config
