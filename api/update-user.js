import { supabase } from '../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  try {
    const updates = req.body;
    if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
      return res.status(400).json({ status: 'error', message: 'Invalid request body' });
    }

    const userId = updates.id;
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ status: 'error', message: 'Missing or invalid user ID' });
    }

    const protectedKeys = ['id', 'hardware-id'];
    const sanitizedUpdates = { ...updates };
    protectedKeys.forEach((key) => delete sanitizedUpdates[key]);

    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    let responseData;
    if (!existingUser) {
      const { data, error } = await supabase
        .from('users')
        .insert([{ id: userId, ...sanitizedUpdates }])
        .single();
      if (error) throw error;
      responseData = data;
    } else {
      const mergedData = { ...existingUser, ...sanitizedUpdates, id: userId };
      const { data, error } = await supabase
        .from('users')
        .update(mergedData)
        .eq('id', userId)
        .single();
      if (error) throw error;
      responseData = data;
    }

    const action = existingUser ? 'User updated successfully' : 'User created successfully';
    return res.status(200).json({
      status: 'success',
      message: action,
      data: responseData
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Server error while updating user',
      details: error.message
    });
  }
}
