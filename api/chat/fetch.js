import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({status: 'error', message: 'Method Not Allowed'});
  }

  const email = req.query.email;
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({status: 'error', message: 'Missing or invalid email'});
  }

  try {
    const {data: userMessages, error: userError} = await supabase
      .from('chat_messages')
      .select('message, timestamp')
      .eq('user_email', email);
    if (userError) throw userError;

    const {data: replies, error: replyError} = await supabase
      .from('chat_reply')
      .select('reply, timestamp')
      .eq('user_email', email);
    if (replyError) throw replyError;

    const userMsgsWithSender = userMessages.map(m => ({...m, sender: 'user'}));
    const replyMsgsWithSender = replies.map(m => ({...m, sender: 'admin'}));
    const allMessages = [...userMsgsWithSender, ...replyMsgsWithSender].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    return res.status(200).json({
      status: 'success',
      data: allMessages
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
