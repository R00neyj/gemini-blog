import { supabase } from './supabaseClient';

/**
 * Creates a notification for a user.
 * @param {string} userId - The recipient user ID.
 * @param {string} actorId - The actor (sender) user ID.
 * @param {string} type - 'comment' or 'like'.
 * @param {string} postId - The related post ID.
 */
export async function createNotification({ userId, actorId, type, postId }) {
  if (!userId || !actorId || !postId) return;
  
  // Don't notify if the actor is the recipient (e.g., liking own post)
  if (userId === actorId) return;

  try {
    // Check for existing unread notification of same type/actor/post to avoid spam (especially for likes)
    if (type === 'like') {
      const { data } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', userId)
        .eq('actor_id', actorId)
        .eq('type', type)
        .eq('post_id', postId)
        .eq('is_read', false)
        .single();
      
      if (data) return; // Already notified
    }

    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        actor_id: actorId,
        type,
        post_id: postId
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}
