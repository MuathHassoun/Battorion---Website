import { IncomingForm } from 'formidable';
import fetch from 'node-fetch';
import FormData from 'form-data';

export const config = {
  api: {
    bodyParser: false,
  },
};

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const form = new IncomingForm({ multiples: false });
  const data = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  const { name, email, phone, subject, category, message } = data.fields;
  const screenshot = data.files.screenshot;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

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

  let imageSent = false;
  if (screenshot && screenshot.filepath && screenshot.size > 0) {
    const buffer = await fs.promises.readFile(screenshot.filepath);
    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('photo', buffer, screenshot.originalFilename || 'screenshot.png');

    const sendPhoto = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders(),
    });

    if (!sendPhoto.ok) {
      const errBody = await sendPhoto.text();
      console.error(errBody);
      return res.status(500).json({ error: 'Failed to send image to Telegram' });
    }
    imageSent = true;
  }

  return res.status(200).json({ result: imageSent ? 'with_image' : 'no_image' });
}
