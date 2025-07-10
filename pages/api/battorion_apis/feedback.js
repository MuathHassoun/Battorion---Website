import fetch from 'node-fetch';
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { UserID, UserName, UserEmail, UserFeedback } = req.body;

  if (!UserID || !UserName || !UserEmail || !UserFeedback) {
    return res.status(400).json({ error: 'Missing one or more required fields' });
  }

  const message = `
  ----- FEEDBACK FORM -----
  UserID:
  ${UserID}

  UserName:
  ${UserName}

  UserEmail:
  ${UserEmail}

  UserFeedback:
  ${UserFeedback}
  -------------------------
  `;

  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      }),
    });

    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.json();
      return res.status(500).json({ error: 'Telegram API error', details: errorData });
    }

    res.status(200).json({ ok: true, message: 'Feedback sent to Telegram' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
