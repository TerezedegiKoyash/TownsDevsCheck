import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

const TELEGRAM_BOT_TOKEN = '7597807364:AAEhAZ3hUbinByn94llIAXkQktJzMeqEr18';
const TELEGRAM_CHAT_ID = '448675531';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const payload = req.body;

  try {
    const msg = `💰 Движение по кошельку:
Hash: ${payload.event.transaction.hash}
From: ${payload.event.transaction.from}
To: ${payload.event.transaction.to}
Value: ${payload.event.transaction.value}`;

    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: msg,
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Ошибка отправки в Telegram:', error);
    res.status(500).json({ error: 'Failed to send to Telegram' });
  }
}
