import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  const { user_email, message , csfrm } = req.body;

  if (!user_email || typeof user_email !== 'string' || !user_email.includes('@')) {
    return res.status(400).json({ status: 'error', message: 'Invalid or missing email' });
  }

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ status: 'error', message: 'Message cannot be empty' });
  }

  try {
    if (csfrm === undefined || !Number.isInteger(csfrm)) {
      return res.status(400).json({ status: 'error', message: 'Invalid or missing csfrm value' });
    }

    let tableName;
    if (csfrm === 0) {
      tableName = 'chat_messages';
    } else if (csfrm === 1) {
      tableName = 'chat_replay';
    } else {
      return res.status(400).json({ status: 'error', message: 'Invalid csfrm type' });
    }

    const { data, error } = await supabase
      .from(tableName)
      .insert([{ user_email, message, timestamp: new Date().toISOString() }]);

    if (error) throw error;

    return res.status(201).json({
      status: 'success',
      message: 'Message saved successfully',
      data
    });

  } catch (error) {
    console.error('[API ERROR - SEND MESSAGE]:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error while saving message',
      error: {
        code: error.code || null,
        message: error.message || 'Unknown error'
      }
    });
  }
}
