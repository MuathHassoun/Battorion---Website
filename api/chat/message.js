import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  const method = req.method;
  const action = req.query.action;

  if (method === 'GET' && action === 'fetch') {
    const email = req.query.email;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ status: 'error', message: 'Missing or invalid email' });
    }

    try {
      const { data: userMessages, error: userError } = await supabase
        .from('chat_messages')
        .select('message, timestamp')
        .eq('user_email', email);
      if (userError) throw userError;

      const { data: replies, error: replyError } = await supabase
        .from('chat_reply')
        .select('reply, timestamp')
        .eq('user_email', email);
      if (replyError) throw replyError;

      const userMsgs = userMessages.map(m => ({ message: m.message, timestamp: m.timestamp, sender: 'user' }));
      const adminMsgs = replies.map(r => ({ message: r.reply, timestamp: r.timestamp, sender: 'admin' }));
      const allMessages = [...userMsgs, ...adminMsgs].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      return res.status(200).json({ status: 'success', data: allMessages });
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

  if (method === 'POST' && action === 'send') {
    const { user_email, message } = req.body;

    if (!user_email || typeof user_email !== 'string' || !user_email.includes('@')) {
      return res.status(400).json({ status: 'error', message: 'Invalid or missing email' });
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ status: 'error', message: 'Message cannot be empty' });
    }

    try {
      const { data, error } = await supabase
        .from('chat_messages')
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
  return res.status(405).json({
    status: 'error',
    message: 'Invalid method or action'
  });
}
