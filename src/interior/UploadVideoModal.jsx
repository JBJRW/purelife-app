import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { IT, IT_FONT_HEAD, IT_FONT_BODY } from './tokens';
import { tui } from '../i18n';

// Filtro básico de palabras clave sobre título/descripción — capa
// extra de seguridad, no un moderador de contenido completo. El
// video en sí no se puede filtrar automáticamente; por eso la
// publicación instantánea (decisión de Jorge) depende de que los
// usuarios respeten las normas de la comunidad.
const BLOCKED_TERMS = [
  'nude', 'naked', 'nsfw', 'porn', 'sex', 'sexual', 'explicit', 'xxx',
  'desnud', 'sexo', 'erotic', 'erótic', 'fetish', 'topless',
];

function containsBlockedTerm(text) {
  const lower = text.toLowerCase();
  return BLOCKED_TERMS.some((term) => lower.includes(term));
}

const MAX_FILE_BYTES = 150 * 1024 * 1024; // 150MB, igual al límite del bucket
const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

export default function UploadVideoModal({ user, lang = 'en', onClose, onUploaded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | uploading | success | error
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!ALLOWED_TYPES.includes(f.type)) {
      setError(tui(lang, 'uploadError'));
      return;
    }
    if (f.size > MAX_FILE_BYTES) {
      setError(tui(lang, 'uploadMaxSize'));
      return;
    }
    setError('');
    setFile(f);
  };

  const handleSubmit = async () => {
    if (!user?.id || !user?.token) {
      setError(tui(lang, 'uploadSignInRequired'));
      return;
    }
    if (!file) return;
    if (containsBlockedTerm(title) || containsBlockedTerm(description)) {
      setError(tui(lang, 'uploadContentBlocked'));
      return;
    }

    setStatus('uploading');
    setError('');

    try {
      const ext = file.name.split('.').pop() || 'mp4';
      const path = `${user.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(path, file, { contentType: file.type, upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('videos').getPublicUrl(path);
      const video_url = publicUrlData?.publicUrl;
      if (!video_url) throw new Error('no_public_url');

      const { data: inserted, error: insertError } = await supabase
        .from('video_feed')
        .insert({
          title: title.trim() || null,
          description: description.trim() || null,
          video_url,
          author_name: user.name || user.email?.split('@')[0] || null,
          user_id: user.id,
          is_published: true,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setStatus('success');
      setTimeout(() => {
        onUploaded?.(inserted);
        onClose?.();
      }, 1200);
    } catch (e) {
      console.error('[UploadVideoModal] upload failed:', e);
      setStatus('error');
      setError(tui(lang, 'uploadError'));
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 3000,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 480, background: IT.obsidian,
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          padding: '24px 20px calc(24px + env(safe-area-inset-bottom))',
          border: `1px solid ${IT.divider}`, borderBottom: 'none',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ fontFamily: IT_FONT_HEAD, color: IT.goldLight, fontSize: 20, fontStyle: 'italic' }}>
            {tui(lang, 'uploadTitle')}
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: IT.textSecondary, fontSize: 20, cursor: 'pointer',
          }}>
            ✕
          </button>
        </div>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: IT.emerald, fontFamily: IT_FONT_BODY, fontSize: 15, fontWeight: 700 }}>
            {tui(lang, 'uploadSuccess')}
          </div>
        ) : (
          <>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={tui(lang, 'uploadTitlePlaceholder')}
              style={{
                width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 12,
                border: `1.5px solid ${IT.divider}`, background: 'rgba(255,255,255,0.04)',
                color: IT.cream, fontSize: 14, fontFamily: IT_FONT_BODY, marginBottom: 10,
              }}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={tui(lang, 'uploadDescPlaceholder')}
              rows={2}
              style={{
                width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 12,
                border: `1.5px solid ${IT.divider}`, background: 'rgba(255,255,255,0.04)',
                color: IT.cream, fontSize: 14, fontFamily: IT_FONT_BODY, resize: 'none', marginBottom: 12,
              }}
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '100%', padding: '14px', borderRadius: 14, cursor: 'pointer', marginBottom: 4,
                border: `1.5px solid ${file ? IT.emerald : IT.divider}`,
                background: file ? `${IT.emerald}18` : 'rgba(255,255,255,0.03)',
                color: IT.cream, fontSize: 14, fontWeight: 600, fontFamily: IT_FONT_BODY,
              }}
            >
              {file ? `✅ ${file.name}` : tui(lang, 'uploadSelectFile')}
            </button>
            <div style={{ color: IT.textSecondary, fontSize: 11, textAlign: 'center', marginBottom: 16 }}>
              {tui(lang, 'uploadMaxSize')}
            </div>

            {error && (
              <div style={{
                color: '#E06B5C', fontSize: 12, marginBottom: 12, padding: '8px 12px',
                background: 'rgba(224,107,92,0.1)', borderRadius: 10, fontFamily: IT_FONT_BODY, textAlign: 'center',
              }}>
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!file || status === 'uploading'}
              style={{
                width: '100%', padding: '15px', borderRadius: 14,
                cursor: (!file || status === 'uploading') ? 'not-allowed' : 'pointer',
                border: 'none',
                background: (!file || status === 'uploading') ? IT.divider : `linear-gradient(135deg, ${IT.emerald}, #1A5C3A)`,
                color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: IT_FONT_BODY,
                opacity: (!file || status === 'uploading') ? 0.6 : 1,
              }}
            >
              {status === 'uploading' ? tui(lang, 'uploadUploading') : tui(lang, 'uploadSubmit')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
