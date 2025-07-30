import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'ps-scripts', 'install.ps1');
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(content);
  } catch (err) {
    res.status(500).json({ error: 'Script not found or failed to load.' });
  }
}
