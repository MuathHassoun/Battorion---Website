const fs = require('fs');
const path = require('path');

function readJsonFileSync(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const data = fs.readFileSync(filePath, 'utf-8');
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  const userId = req.query.id;
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ status: 'error', message: 'Missing or invalid user ID' });
  }

  try {
    const indexFile = path.join(process.cwd(), 'data', 'users_index.json');
    const indexData = readJsonFileSync(indexFile);

    if (!indexData || !indexData[userId]) {
      return res.status(404).json({ status: 'error', message: 'User ID not found' });
    }

    const userFileName = indexData[userId];
    const userFile = path.join(process.cwd(), 'data', 'users', userFileName);
    const userData = readJsonFileSync(userFile);

    if (!userData) {
      return res.status(404).json({ status: 'error', message: 'User data file not found or corrupted' });
    }
    
    return res.status(200).json({
      status: 'success',
      data: userData
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Server error while fetching user data',
      details: error.message
    });
  }
};
