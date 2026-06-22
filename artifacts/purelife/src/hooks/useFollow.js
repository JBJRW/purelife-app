import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useFollow(currentUserId) {
  const [following, setFollowing] = useState(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUserId) return;
    const fetchFollows = async () => {
      const { data } = await supabase
        .from('follows').select('following_id')
        .eq('follower_id', currentUserId);
      if (data) setFollowing(new Set(data.map(f => f.following_id)));
    };
    fetchFollows();
    const channel = supabase.channel('follows-changes')
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'follows',
        filter: `follower_id=eq.${currentUserId}`
      }, (payload) => {
        if (payload.eventType === 'INSERT')
          setFollowing(prev => new Set([...prev, payload.new.following_id]));
        else if (payload.eventType === 'DELETE')
          setFollowing(prev => { const n = new Set(prev); n.delete(payload.old.following_id); return n; });
      }).subscribe();
    return () => supabase.removeChannel(channel);
  }, [currentUserId]);

  const toggleFollow = useCallback(async (targetUserId) => {
    if (!currentUserId || loading) return;
    setLoading(true);
    const isF = following.has(targetUserId);
    try {
      if (isF) {
        await supabase.from('follows').delete()
          .eq('follower_id', currentUserId).eq('following_id', targetUserId);
        setFollowing(prev => { const n = new Set(prev); n.delete(targetUserId); return n; });
      } else {
        await supabase.from('follows').insert({ follower_id: currentUserId, following_id: targetUserId });
        setFollowing(prev => new Set([...prev, targetUserId]));
      }
    } catch (err) { console.error('Follow error:', err); }
    finally { setLoading(false); }
  }, [currentUserId, following, loading]);

  const isFollowing = useCallback((userId) => following.has(userId), [following]);
  return { isFollowing, toggleFollow, loading };
}