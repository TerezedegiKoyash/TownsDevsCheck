import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const payload = req.body;
  console.log('Alchemy payload:', JSON.stringify(payload, null, 2));

  try {
    const hash = payload?.event?.transaction?.hash ?? 'нет данных';
    const from = payload?.event?.transaction?.from ?? 'нет данных';
    const to = payload?.event?.transaction?.to ?? 'нет данных';
    const value = payload?.event?.transaction?.value ?? 'нет данных';

    const msg = `💰 Движение по кошельку:
Hash: ${hash}
From: ${from}
To: ${to}
Value: ${value}`;

    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: msg,
    });

    res.status(200).json({ ok: true });
  } catch (error: any) {
    console.error('Ошибка отправки в Telegram:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to send to Telegram' });
  }
}
