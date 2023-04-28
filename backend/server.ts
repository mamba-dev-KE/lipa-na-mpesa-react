
import express from 'express';
import type { Express, Response } from 'express'
import dotenv from 'dotenv';
import axios from 'axios'
import { Buffer } from 'node:buffer'

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5500;
const CONSUMER_KEY = process.env.CONSUMER_KEY!
const CONSUMER_SECRET = process.env.CONSUMER_SECRET!
const AUTH_URL = process.env.AUTH_URL!

app.get('/', (_, res: Response) => {
  res.status(200).json({ message: 'Hello, world!' });
});

app.get('/payment/auth', async (_, res: Response) => {
  const token = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64')

  try {
    const response = await axios.get(AUTH_URL, {
      headers: {
        Authorization: `Basic ${token}`
      }
    });

    if (response.status === 200) {
      res.status(200).json(response.data)
    }
  } catch (err) {
    res.status(400).json({ message: 'An error occurred' })
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});