import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  const email = req.query.email;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ status: 'error', message: 'Missing or invalid email' });
  }

  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('message, timestamp')
      .eq('user_email', email)
      .order('timestamp', { ascending: true });

    if (error) throw error;

    return res.status(200).json({
      status: 'success',
      data
    });

  } catch (error) {
    console.error('[API ERROR - FETCH MESSAGES]:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch messages',
      error: {
        code: error.code || null,
        message: error.message || 'Unknown error'
      }
    });
  }
}
