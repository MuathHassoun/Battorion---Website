const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function getSafeFilename(userId) {
  return crypto.createHash('sha256').update(userId).digest('hex');
}

function readJsonFileSync(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const data = fs.readFileSync(filePath, 'utf-8');
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function writeJsonFileSync(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  try {
    const updates = req.body;
    const userId = updates.id;
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ status: 'error', message: 'Missing or invalid user ID' });
    }

    const safeName = getSafeFilename(userId);
    const usersDir = path.join(process.cwd(), 'data', 'users');
    if (!fs.existsSync(usersDir)) {
      fs.mkdirSync(usersDir, { recursive: true });
    }

    const userFile = path.join(usersDir, `${safeName}.json`);
    const indexFile = path.join(process.cwd(), 'data', 'users_index.json');

    const isFirstTime = !fs.existsSync(userFile);
    let existingData = {};
    if (!isFirstTime) {
      existingData = readJsonFileSync(userFile);
    }

    const protectedKeys = ['id', 'hardware-id'];
    for (const key of protectedKeys) {
      if (!isFirstTime && updates.hasOwnProperty(key)) {
        delete updates[key];
      }
    }

    const updatedUser = { ...existingData, ...updates };
    updatedUser.id = existingData.id || updates.id;

    writeJsonFileSync(userFile, updatedUser);

    if (isFirstTime) {
      const indexData = readJsonFileSync(indexFile);
      indexData[userId] = `${safeName}.json`;
      writeJsonFileSync(indexFile, indexData);
    }

    return res.status(200).json({
      status: 'success',
      message: isFirstTime ? 'User created successfully' : 'User updated successfully',
      data: updatedUser
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Server error while updating user',
      details: error.message
    });
  }
};
