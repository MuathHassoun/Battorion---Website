const { IncomingForm } = require('formidable');
const fs = require('fs');
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

  const form = new IncomingForm({ multiples: false });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(400).json({ error: 'Failed to parse form' });
    }

    const { name, email, phone, subject, category, message } = fields;
    const screenshot = files.screenshot;
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
      // 1. Send text first
      const sendMessage = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text,
          parse_mode: 'HTML',
        }),
      });

      if (!sendMessage.ok) {
        const err = await sendMessage.json();
        console.error('Telegram text send error:', err);
        return res.status(500).json({ error: 'Failed to send message' });
      }

      // 2. If there's a screenshot, upload it
      if (screenshot) {
        const mime = screenshot.mimetype;
        if (!mime.startsWith('image/')) {
          return res.status(400).json({ error: 'Uploaded file must be an image' });
        }

        const photoStream = fs.createReadStream(screenshot.filepath);
        const formData = new FormData();
        formData.append('chat_id', CHAT_ID);
        formData.append('photo', photoStream);

        const sendPhoto = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
          method: 'POST',
          body: formData,
        });

        if (!sendPhoto.ok) {
          const err = await sendPhoto.json();
          console.error('Telegram photo send error:', err);
          return res.status(500).json({ error: 'Failed to send image to Telegram' });
        }
      }
      return res.status(200).json({ message: 'Message (and image) sent successfully' });
    } catch (error) {
      console.error('Server error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
};
