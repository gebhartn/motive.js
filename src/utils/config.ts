interface Config {
  secret: string
}

export default { secret: process.env.SECRET || 'FG01vf67JrB49F8n8n!' } as Config
