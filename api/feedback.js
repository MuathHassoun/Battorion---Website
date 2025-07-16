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

  const { UserID, UserName, UserEmail, UserFeedback, SupportImage } = req.body;
  if (!UserID || !UserName || !UserEmail || !UserFeedback) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const message = `
  📝 FEEDBACK FORM 📝
  👤 UserID: ${escapeHtml(UserID)}
  📛 UserName: ${escapeHtml(UserName)}
  📧 Email: ${escapeHtml(UserEmail)}
  💬 Feedback:
  ${escapeHtml(UserFeedback)}
  `;

  try {
    if (SupportImage) {
      let buffer;
      try {
        buffer = Buffer.from(SupportImage, 'base64');
      } catch (e) {
        return res.status(400).json({ error: 'Invalid image encoding' });
      }

      const pngSignature = '89504e47';
      const jpgSignature = 'ffd8ffe0';
      const jpgSignatureAlt = 'ffd8ffe1';
      const jpgSignatureAlt2 = 'ffd8ffe2';
      const hexHeader = buffer.toString('hex', 0, 4);

      if (
        hexHeader !== pngSignature &&
        hexHeader !== jpgSignature &&
        hexHeader !== jpgSignatureAlt &&
        hexHeader !== jpgSignatureAlt2
      ) {
        return res.status(400).json({ error: 'Invalid image format (only PNG/JPEG supported)' });
      }

      const formData = new FormData();
      formData.append('chat_id', CHAT_ID);
      formData.append('caption', message);
      formData.append('parse_mode', 'HTML');
      const blob = new Blob([buffer], { type: 'image/jpeg' });
      formData.append('photo', blob, 'feedback_image.jpg');

      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const err = await response.json();
        console.error('Telegram API error:', err);
        return res.status(500).json({
          status: 'warning',
          message: 'Telegram failed to receive image'
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'Your feedback and image have been received. Thank you!'
      });
    } else {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        console.error('Telegram API error:', err);
        return res.status(500).json({
          status: 'warning',
          message: 'Telegram failed to receive message'
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'Your feedback has been received. Thank you!'
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error'
    });
  }
};
