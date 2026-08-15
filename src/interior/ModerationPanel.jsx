import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { IT, IT_FONT_HEAD, IT_FONT_BODY } from './tokens';
import { tui } from '../i18n';

export default function ModerationPanel({ lang = 'en', onClose }) {
  const [rows, setRows] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Traemos los videos más recientes (publicados o no, gracias a
      // la policy video_select_admin_all) y los reportes por video,
      // y los combinamos en el cliente — evita depender de una vista
      // SQL adicional para este panel simple.
      const [videosRes, reportsRes] = await Promise.all([
        supabase.from('video_feed').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('video_reports').select('video_id'),
      ]);
      if (cancelled) return;

      const reportCounts = {};
      (reportsRes.data || []).forEach((r) => {
        reportCounts[r.video_id] = (reportCounts[r.video_id] || 0) + 1;
      });

      const combined = (videosRes.data || []).map((v) => ({ ...v, report_count: reportCounts[v.id] || 0 }));
      // Videos con reportes primero, luego el resto por fecha
      combined.sort((a, b) => (b.report_count - a.report_count) || 0);
      setRows(combined);
    })();
    return () => { cancelled = true; };
  }, []);

  const unpublish = async (id) => {
    setBusyId(id);
    try {
      await supabase.from('video_feed').update({ is_published: false }).eq('id', id);
      setRows((rs) => rs.map((r) => (r.id === id ? { ...r, is_published: false } : r)));
    } catch (e) {
      console.error('[ModerationPanel] unpublish failed:', e);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 3100,
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 520, maxHeight: '85vh', background: IT.obsidian,
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          padding: '20px 16px calc(20px + env(safe-area-inset-bottom))',
          border: `1px solid ${IT.divider}`, borderBottom: 'none',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexShrink: 0 }}>
          <div style={{ fontFamily: IT_FONT_HEAD, color: IT.goldLight, fontSize: 19, fontStyle: 'italic' }}>
            {tui(lang, 'modPanelTitle')}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: IT.textSecondary, fontSize: 20, cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {rows === null && (
            <div style={{ textAlign: 'center', color: IT.textSecondary, padding: 24, fontSize: 13 }}>...</div>
          )}
          {rows?.length === 0 && (
            <div style={{ textAlign: 'center', color: IT.textSecondary, padding: 24, fontSize: 13 }}>
              {tui(lang, 'modPanelEmpty')}
            </div>
          )}
          {rows?.map((v) => (
            <div key={v.id} style={{
              display: 'flex', gap: 10, alignItems: 'center', padding: '10px 8px',
              borderBottom: `1px solid ${IT.divider}`,
              opacity: v.is_published ? 1 : 0.45,
            }}>
              <video src={v.video_url} muted style={{ width: 48, height: 64, objectFit: 'cover', borderRadius: 8, background: '#000', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: IT.cream, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {v.title || '(sin título)'}
                </div>
                <div style={{ color: IT.textSecondary, fontSize: 11 }}>
                  @{v.author_name || '?'} · {v.report_count > 0 ? (
                    <span style={{ color: '#E06B5C', fontWeight: 700 }}>{tui(lang, 'modReports')(v.report_count)}</span>
                  ) : '0'}
                  {!v.is_published && ` · ${tui(lang, 'modUnpublished')}`}
                </div>
              </div>
              {v.is_published && (
                <button
                  onClick={() => unpublish(v.id)}
                  disabled={busyId === v.id}
                  style={{
                    flexShrink: 0, padding: '7px 12px', borderRadius: 10, cursor: 'pointer',
                    border: '1px solid #E06B5C', background: 'rgba(224,107,92,0.1)',
                    color: '#E06B5C', fontSize: 11, fontWeight: 700, fontFamily: IT_FONT_BODY,
                    opacity: busyId === v.id ? 0.5 : 1,
                  }}
                >
                  {tui(lang, 'modUnpublish')}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
