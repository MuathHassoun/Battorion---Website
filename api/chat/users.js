import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('chat_users')
      .select('user_email')
      .order('created_at', { ascending: true });

    if (error) throw error;

    return res.status(200).json({
      status: 'success',
      users: data.map(row => ({ email: row.user_email }))
    });

  } catch (error) {
    console.error('[API ERROR - GET USERS]:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users',
      error: {
        code: error.code || null,
        message: error.message || 'Unknown error'
      }
    });
  }
}
