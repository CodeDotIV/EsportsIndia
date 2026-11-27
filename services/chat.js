
import { requireSupabase } from './supabase';

function getSupabase() {
  return requireSupabase();
}

// Get the logged-in user
async function getCurrentUser() {
  const supabase = getSupabase();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error('Please log in first');

  return user;
}

// Create a private chat or retrieve the existing one
export async function getOrCreatePrivateChat(targetUserId) {
  if (!targetUserId || typeof targetUserId !== 'string') {
    throw new Error('Invalid target user ID');
  }

  const supabase = getSupabase();
  const user = await getCurrentUser();

  console.log('[CHAT DEBUG] Logged-in user:', user.id);
  console.log('[CHAT DEBUG] Target user:', targetUserId);

  if (user.id === targetUserId) {
    throw new Error('You cannot chat with yourself');
  }

  const { data, error } = await supabase.rpc(
    'get_or_create_private_chat',
    {
      target_user_id: targetUserId,
    }
  );

  if (error) {
    console.error('[CHAT DEBUG] RPC error:', error.message);
    throw error;
  }

  console.log('[CHAT DEBUG] Chat room ID:', data);

  if (!data) {
    throw new Error('Unable to create or retrieve chat room');
  }

  return data;
}

// Load messages from a conversation
export async function getChatMessages(chatId, limit = 50) {
  if (!chatId) throw new Error('Invalid chat');

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('messages')
    .select('id, chat_id, sender_id, content, created_at, is_read')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('[CHAT DEBUG] Load messages error:', error.message);
    throw error;
  }

  return data || [];
}

// Send a message
export async function sendChatMessage(chatId, content) {
  if (!chatId) throw new Error('Invalid chat');

  const message = String(content || '').trim();

  if (!message) {
    throw new Error('Message cannot be empty');
  }

  if (message.length > 5000) {
    throw new Error('Message cannot exceed 5000 characters');
  }

  const supabase = getSupabase();
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from('messages')
    .insert({
      chat_id: chatId,
      sender_id: user.id,
      content: message,
    })
    .select()
    .single();

  if (error) {
    console.error('[CHAT DEBUG] Send message error:', error.message);
    throw error;
  }

  return data;
}

// Mark incoming messages as read
export async function markChatMessagesAsRead(chatId) {
  if (!chatId) throw new Error('Invalid chat');

  const supabase = getSupabase();
  const user = await getCurrentUser();

  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('chat_id', chatId)
    .neq('sender_id', user.id)
    .eq('is_read', false);

  if (error) {
    console.error('[CHAT DEBUG] Mark as read error:', error.message);
    throw error;
  }

  return true;
}

// Load the user's personal chat list
export async function getMyChats() {
  const supabase = getSupabase();
  const user = await getCurrentUser();

  const { data: chats, error } = await supabase
    .from('chats')
    .select('id, user_one, user_two, created_at, last_message_at')
    .or(`user_one.eq.${user.id},user_two.eq.${user.id}`)
    .order('last_message_at', { ascending: false });

  if (error) {
    console.error('[CHAT DEBUG] Load chats error:', error.message);
    throw error;
  }

  const results = await Promise.all(
    (chats || []).map(async (chat) => {
      const otherUserId =
        chat.user_one === user.id
          ? chat.user_two
          : chat.user_one;

      const { data: lastMessage, error: messageError } =
        await supabase
          .from('messages')
          .select('id, content, sender_id, created_at, is_read')
          .eq('chat_id', chat.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

      if (messageError) throw messageError;

      return {
        ...chat,
        otherUserId,
        lastMessage: lastMessage || null,
      };
    })
  );

  return results;
}

// Listen for new messages in a conversation
export function subscribeToChatMessages(chatId, onMessage) {
  if (!chatId || typeof onMessage !== 'function') {
    throw new Error('Invalid chat subscription');
  }

  const supabase = getSupabase();

  const channel = supabase
    .channel(`private-chat-${chatId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`,
      },
      (payload) => {
        if (payload.new) {
          onMessage(payload.new);
        }
      }
    )
    .subscribe((status, error) => {
      console.log('[CHAT DEBUG] Realtime status:', status);

      if (error) {
        console.error('[CHAT DEBUG] Realtime error:', error);
      }
    });

  return channel;
}

// Stop listening when leaving the conversation
export async function unsubscribeFromChat(channel) {
  if (!channel) return;

  const supabase = getSupabase();
  await supabase.removeChannel(channel);
}
