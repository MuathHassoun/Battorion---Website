const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('Missing TOKEN or ID in environment variables');
    return res.status(500).json({ error: 'Server configuration error: missing environment variables' });
  }

  const { name, email, phone, subject, category, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const text = `
📬 <b>New Contact Message</b>
👤 <b>Name:</b> ${escapeHtml(name)}
📧 <b>Email:</b> ${escapeHtml(email)}
📞 <b>Phone:</b> ${escapeHtml(phone || "N/A")}
🏷️ <b>Subject:</b> ${escapeHtml(subject || "N/A")}
📂 <b>Category:</b> ${escapeHtml(category || "N/A")}
💬 <b>Message:</b>
${escapeHtml(message)}
`;

  try {
    const telegramRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'HTML',
      }),
    });

    if (!telegramRes.ok) {
      const err = await telegramRes.json();
      console.error('Telegram API error:', err);
      return res.status(500).json({ error: 'Telegram failed to receive message' });
    }

    return res.status(200).json({ message: 'Message sent successfully to Telegram' });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
