const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in environment variables');
    return res.status(500).json({ error: 'Server configuration error: missing environment variables' });
  }

  const { UserID, UserName, UserEmail, UserFeedback } = req.body;

  if (!UserID || !UserName || !UserEmail || !UserFeedback) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const message = `
📝 *FEEDBACK FORM* 📝
👤 *UserID:* ${UserID}
📛 *UserName:* ${UserName}
📧 *Email:* ${UserEmail}
💬 *Feedback:*
${UserFeedback}
`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Telegram API error:', err);
      return res.status(500).json({ error: 'Telegram Error', details: err });
    }

    res.status(200).json({ message: 'Feedback sent successfully!' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};
