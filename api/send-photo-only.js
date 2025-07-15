const { IncomingForm } = require("formidable");
const FormData = require("form-data");
const fs = require("fs");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const form = new IncomingForm({
    multiples: false,
    maxFileSize: 5 * 1024 * 1024,
    keepExtensions: true,
  });

  await form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({error: 'Failed to parse form'});
    }
    const screenshot = Array.isArray(files.screenshot)
      ? files.screenshot[0]
      : files.screenshot;

    let imageSent = false;
    if (screenshot && screenshot.filepath && screenshot.size > 0) {
      try {
        const formData = new FormData();
        formData.append("chat_id", CHAT_ID);
        formData.append(
          "photo",
          fs.createReadStream(screenshot.filepath),
          screenshot.originalFilename || "screenshot.png"
        );

        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
          method: "POST",
          body: formData,
          headers: formData.getHeaders(),
        });

        const result = await response.json();
        if (!result.ok) {
          console.error("Telegram sendPhoto failed:", result.description);
          return res.status(500).json({error: "Failed to send image to Telegram"});
        }

        imageSent = true;
      } catch (error) {
        console.error("Error sending image:", error);
        return res.status(500).json({error: "Failed to send image"});
      }
    }
    return res.status(200).json({result: imageSent});
  });
};
