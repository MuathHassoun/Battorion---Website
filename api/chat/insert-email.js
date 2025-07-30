import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  const { user_email } = req.body;
  if (!user_email || typeof user_email !== 'string' || !user_email.includes('@')) {
    return res.status(400).json({ status: 'error', message: 'Invalid or missing email' });
  }

  try {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('chat_users')
      .insert([{ user_email, created_at: now, last_seen: now }]);

    if (error) {
      throw error;
    }

    return res.status(201).json({
      status: 'success',
      message: 'Email saved successfully',
      data: data
    });

  } catch (error) {
    console.error('[API ERROR - POST]:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error while saving email',
      error: {
        code: error.code || null,
        message: error.message || 'Unknown error'
      }
    });
  }
}
