import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MemberCard } from './MemberCard';
import { useFollow } from '../hooks/useFollow';
import { Users, RefreshCw } from 'lucide-react';

export function SuggestedMembers({ currentUser, maxCards = 6 }) {
  const [suggestions, setSuggestions] = useState([]);
  const [dismissed, setDismissed] = useState(new Set());
  const [loadingData, setLoadingData] = useState(true);
  const { isFollowing, toggleFollow } = useFollow(currentUser?.id);

  const fetchSuggestions = async () => {
    if (!currentUser?.id) return;
    setLoadingData(true);
    try {
      const { data: followingData } = await supabase
        .from('follows').select('following_id').eq('follower_id', currentUser.id);
      const followingIds = followingData?.map(f => f.following_id) || [];
      const excludeIds = [...followingIds, currentUser.id, ...dismissed];

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, membership_tier')
        .not('id', 'in', `(${excludeIds.join(',') || 'null'})`)
        .limit(maxCards + 4);

      if (!profiles) return;

      const { data: theyFollowMe } = await supabase
        .from('follows').select('follower_id')
        .eq('following_id', currentUser.id)
        .in('follower_id', profiles.map(p => p.id));

      const theyFollowSet = new Set(theyFollowMe?.map(f => f.follower_id) || []);
      const enriched = profiles
        .filter(p => !dismissed.has(p.id)).slice(0, maxCards)
        .map(p => ({ ...p, follows_you: theyFollowSet.has(p.id), mutual_count: 0 }));
      enriched.sort((a, b) => (b.follows_you ? 1 : 0) - (a.follows_you ? 1 : 0));
      setSuggestions(enriched);
    } catch (err) { console.error('Suggestions error:', err); }
    finally { setLoadingData(false); }
  };

  useEffect(() => { fetchSuggestions(); }, [currentUser?.id]);

  const handleDismiss = (memberId) => {
    setDismissed(prev => new Set([...prev, memberId]));
    setSuggestions(prev => prev.filter(m => m.id !== memberId));
  };

  if (loadingData) return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <div style={{
        width: '24px', height: '24px', borderRadius: '50%',
        border: '2px solid #4A7C59', borderTopColor: 'transparent',
        animation: 'spin 0.8s linear infinite', margin: '0 auto',
      }} />
    </div>
  );

  if (suggestions.length === 0) return null;

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '14px', padding: '0 2px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <Users size={15} color="#4A7C59" />
          <h3 style={{
            color: '#F5F0E8', fontFamily: 'Fraunces, serif',
            fontSize: '14px', fontWeight: '700', margin: 0,
          }}>Members you may know</h3>
        </div>
        <button onClick={fetchSuggestions} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: '#4A7C59', display: 'flex', alignItems: 'center', gap: '4px',
          fontSize: '10px', fontFamily: 'DM Sans, sans-serif',
        }}>
          <RefreshCw size={11} /> Refresh
        </button>
      </div>
      <div style={{
        display: 'flex', gap: '12px', overflowX: 'auto',
        paddingBottom: '8px', scrollbarWidth: 'none',
        msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch',
      }}>
        {suggestions.map(member => (
          <MemberCard key={member.id} member={member}
            isFollowing={isFollowing(member.id)}
            onFollow={toggleFollow} onDismiss={handleDismiss} />
        ))}
      </div>
    </div>
  );
}