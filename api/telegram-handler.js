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
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024,
    uploadDir: path.join(__dirname, 'tmp')
  });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        return res.status(400).json({ error: 'Failed to parse form' });
      }

      const { name, email, phone, subject, category, message } = fields;
      const screenshot = files.screenshot;
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const safePhone = phone || "N/A";
      const safeSubject = subject || "N/A";
      const safeCategory = category || "N/A";

      const fullMessage = `
📬 <b>New Contact Message</b>
👤 <b>Name:</b> ${escapeHtml(name)}
📧 <b>Email:</b> ${escapeHtml(email)}
📞 <b>Phone:</b> ${escapeHtml(safePhone)}
🏷️ <b>Subject:</b> ${escapeHtml(safeSubject)}
📂 <b>Category:</b> ${escapeHtml(safeCategory)}
💬 <b>Message:</b>
${escapeHtml(message)}
      `.trim();

      let imageSent = false;

      if (screenshot && screenshot.filepath && fs.existsSync(screenshot.filepath)) {
        const mime = screenshot.mimetype || '';
        const filename = screenshot.originalFilename || '';
        if (mime && !mime.startsWith('image/')) {
          return res.status(400).json({ error: 'Uploaded file must be an image' });
        } else if (!mime && !filename.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          return res.status(400).json({ error: 'Uploaded file must be an image (by extension check)' });
        }

        const formData = new FormData();
        formData.append('chat_id', CHAT_ID);
        formData.append('photo', fs.createReadStream(screenshot.filepath));

        // ✅ إرسال كابشن مختصر فقط لتفادي تجاوز الحد
        const shortCaption = `🧾 ${escapeHtml(name)} – ${escapeHtml(safeSubject)}`;
        formData.append('caption', shortCaption);
        formData.append('parse_mode', 'HTML');

        const sendPhoto = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
          method: 'POST',
          body: formData,
          headers: formData.getHeaders(),
        });

        if (!sendPhoto.ok) {
          const errBody = await sendPhoto.text();
          return res.status(500).json({ error: 'Failed to send image to Telegram' });
        }

        imageSent = true;

        // ✅ أرسل الرسالة الكاملة كنص بعد إرسال الصورة
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: fullMessage,
            parse_mode: 'HTML',
          }),
        });

      } else {
        // لا يوجد صورة، أرسل فقط الرسالة النصية الكاملة
        const sendMessage = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: fullMessage,
            parse_mode: 'HTML',
          }),
        });

        if (!sendMessage.ok) {
          const errBody = await sendMessage.text();
          return res.status(500).json({ error: 'Failed to send message' });
        }
      }

      const responseMessage = imageSent ? 'with_image' : 'no_image';
      return res.status(200).json({ result: responseMessage });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
};
