const fs = require('fs');
const path = require('path');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  const { name } = req.query;
  if (!name || typeof name !== 'string' || !name.endsWith('.json')) {
    return res.status(400).json({ status: 'error', message: 'Invalid or missing file name' });
  }
  const filePath = path.join(process.cwd(), name);

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(data);
    return res.status(200).json(json);
  } catch (error) {
    console.error('Error reading file:', error);
    return res.status(404).json({
      status: 'error',
      message: `File "${name}" not found or invalid JSON.`,
      details: error.message
    });
  }
};
