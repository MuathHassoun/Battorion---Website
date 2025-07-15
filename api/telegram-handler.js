const { IncomingForm } = require('formidable');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const form = new IncomingForm({
    multiples: false,
    maxFileSize: 5 * 1024 * 1024,
    keepExtensions: true
  });

  await form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: 'Failed to parse form' });
    }

    const { name, email, phone, subject, category, message } = fields;
    const screenshot = Array.isArray(files.screenshot) ? files.screenshot[0] : files.screenshot;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const safePhone = phone || "N/A";
    const safeSubject = subject || "N/A";
    const safeCategory = category || "N/A";
    const text = `
    📬 <b>New Contact Message</b>
    👤 <b>Name:</b> ${escapeHtml(name)}
    📧 <b>Email:</b> ${escapeHtml(email)}
    📞 <b>Phone:</b> ${escapeHtml(safePhone)}
    🏷️ <b>Subject:</b> ${escapeHtml(safeSubject)}
    📂 <b>Category:</b> ${escapeHtml(safeCategory)}
    💬 <b>Message:</b>
    ${escapeHtml(message)}
    `;

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
      const errBody = await sendMessage.text();
      console.error(errBody);
      return res.status(500).json({ error: 'Failed to send message' });
    }

    console.log("Reach");
    console.log('files:', files);
    console.log('screenshot:', screenshot);
    let imageSent = false;
    if (screenshot && screenshot.filepath && screenshot.size > 0) {
      try {
        console.log("Entered");
        const formData = new FormData();
        formData.append('chat_id', CHAT_ID);
        formData.append(
          'photo',
          fs.createReadStream(screenshot.filepath),
          screenshot.originalFilename || 'screenshot.png'
        );

        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
          method: 'POST',
          body: formData,
          headers: formData.getHeaders(),
        });

        const result = await response.json();

        if (!result.ok) {
          console.error('Telegram sendPhoto failed:', result.description);
          return res.status(500).json({ error: 'Failed to send image to Telegram' });
        }

        imageSent = true;
      } catch (error) {
        console.error('Error sending image:', error);
        return res.status(500).json({ error: 'Failed to send image' });
      }
    }
    console.log("Get out");
    return res.status(200).json({ result: imageSent ? 'with_image' : 'no_image' });
  });
};
