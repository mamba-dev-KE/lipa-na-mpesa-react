
import express from 'express';
import type { Express, Response, Request } from 'express'
import dotenv from 'dotenv';
import axios from 'axios'
import { Buffer } from 'node:buffer'
import ngrok from 'ngrok'
import { getTimestamp } from './utils/helpers';

dotenv.config();

// all required variables

const app: Express = express();
const PORT = process.env.PORT || 5500;
const CONSUMER_KEY = process.env.CONSUMER_KEY!
const CONSUMER_SECRET = process.env.CONSUMER_SECRET!
const AUTH_URL = process.env.AUTH_URL!
const PUSH_STK = process.env.PUSH_STK!
const TIMESTAMP = getTimestamp()
const PASSKEY = process.env.PASSKEY!
const BUSINESS_SHORT_CODE = process.env.BUSINESS_SHORT_CODE!
const PASSWORD = Buffer.from(`${BUSINESS_SHORT_CODE}${PASSKEY}${TIMESTAMP}`).toString('base64')

app.get('/', (_, res: Response) => {
  res.status(200).json({ message: 'Hello, world!' });
});

// get auth token

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
  } catch (error) {
    res.status(400).json({ message: 'An error occurred' })
  }
})

// initiate STK push prompt

app.post('/payment/lipa-na-mpesa', async (req: Request, res: Response) => {
  const config = {
    BusinessShortCode: BUSINESS_SHORT_CODE,
    Password: PASSWORD,
    Timestamp: TIMESTAMP,
    TransactionType: "CustomerPayBillOnline",
    Amount: 1,
    PartyA: 254716445491,
    PartyB: 174379,
    PhoneNumber: 254716445491,
    CallBackURL: "https://mydomain.com/path",
    AccountReference: "CompanyXLTD",
    TransactionDesc: "Payment of X"
  }

  try {
    const response = await axios.post(PUSH_STK, config, {
      headers: {
        Authorization: 'Bearer fmaLDVadose53TV4GHT37vsII02I',
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 200) {
      res.status(200).json(response.data)
    }
  } catch (error) {
    res.status(400).json({ message: 'An error occurred' })
  }
})


app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

ngrok.connect({
  proto: 'http',
  addr: 5500
}).then((url) => {
  console.log(`ngrok ==== opened at: ${url}`)
  console.log('open ngrok dash at https://localhost:4040\n')
}).catch(error => {
  console.error('Error while connecting Ngrok', error);
  return new Error('Ngrok Failed');
})