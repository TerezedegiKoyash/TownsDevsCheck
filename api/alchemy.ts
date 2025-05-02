import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

const BOT  = process.env.TELEGRAM_BOT_TOKEN!;
const CHAT = process.env.TELEGRAM_CHAT_ID!;
const KEY  = process.env.ALCHEMY_SIGNING_KEY!;       // whsec_***

function verify(raw: string, sig: string) {
  const h = crypto.createHmac('sha256', KEY).update(raw).digest('hex');
  return h === sig;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const raw = JSON.stringify(req.body);
  const sig = req.headers['x-alchemy-signature'] as string || '';
  if (!verify(raw, sig)) return res.status(401).end('bad sig');

  // Alchemy Address Activity → event.activity[]
  for (const a of req.body.event?.activity ?? []) {
    const txt =
`🔔 ${a.category?.toUpperCase() || 'TX'}
from: ${a.from}
to:   ${a.to}
hash: ${a.hash}
value: ${a.value || '0'}`;
    await fetch(`https://api.telegram.org/bot${BOT}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT, text: txt })
    });
  }
  res.status(200).end('ok');
}
