import { Request, Response } from "express";
import axios from 'axios'

const AUTH_URL = process.env.AUTH_URL!
const CONSUMER_KEY = process.env.CONSUMER_KEY!
const CONSUMER_SECRET = process.env.CONSUMER_SECRET!

export const getAuthTokenMiddleware = async (req: Request, res: Response, next: any) => {
  console.log('I run')
  const token = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

  try {
    const response = await axios.get(AUTH_URL, {
      headers: {
        Authorization: `Basic ${token}`
      }
    });

    if (response.status === 200) {
      // req.token = response['access_token']
      res.locals.data = response.data;
      return next();
    }
  } catch (error) {
    res.status(400).json({ message: 'An error occurred' });
  }
};

