import { z } from 'zod'

const envVariables = z.object({
  CONSUMER_KEY: z.string(),
  CONSUMER_SECRET: z.string(),
  AUTH_URL: z.string()
})

envVariables.parse(process.env)

declare global {
  namespace NodeJS {
    interface ProcessENV extends z.infer<typeof envVariables> { }
  }
}