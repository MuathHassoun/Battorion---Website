import { supabase } from '../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  const userId = req.query.id;
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ status: 'error', message: 'Missing or invalid user ID' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && (error.code === 'PGRST116' || (error.message || '').includes('Results contain 0 rows'))) {
      return res.status(404).json({ status: 'error', message: 'User ID not found' });
    }

    if (error) {
      throw error;
    }

    return res.status(200).json({
      status: 'success',
      data: data
    });

  } catch (error) {
    const safeError = {
      code: error.code || null,
      message: error.message || 'Unknown error',
      hint: error.hint || null,
      details: error.details || null
    };

    console.error('[API ERROR - GET]:', safeError);

    return res.status(500).json({
      status: 'error',
      message: 'Server error while fetching user data',
      error: safeError
    });
  }
}
