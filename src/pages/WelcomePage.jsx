import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function WelcomePage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [memberNumber, setMemberNumber] = useState(null);

  useEffect(() => {
    verifyAndActivate();
  }, []);

  async function verifyAndActivate() {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    if (!sessionId) {
      setStatus('error');
      return;
    }

    // Poll Supabase to confirm webhook has processed (max 8 seconds)
    let attempts = 0;
    const maxAttempts = 8;

    const poll = setInterval(async () => {
      attempts++;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        clearInterval(poll);
        setStatus('error');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('membership_tier, founding_member_number')
        .eq('id', user.id)
        .single();

      if (profile?.membership_tier === 'founding_member') {
        clearInterval(poll);
        setMemberNumber(profile.founding_member_number);
        setStatus('success');
      } else if (attempts >= maxAttempts) {
        clearInterval(poll);
        // Show success anyway — webhook may still be processing
        setStatus('success');
      }
    }, 1000);
  }

  if (status === 'verifying') {
    return (
      <div className="welcome-screen">
        <div className="verifying-state">
          <div className="pulse-ring" />
          <p>Activando tu membresía...</p>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="welcome-screen">
        <div className="error-state">
          <h2>Algo salió mal</h2>
          <p>Tu pago puede haber sido procesado. Revisa tu email o contáctanos.</p>
          <button onClick={() => navigate('/dashboard')}>Ir al Dashboard</button>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="welcome-screen">
      <div className="success-state">
        {/* Badge */}
        <div className="founding-badge">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="30" stroke="#C9973A" strokeWidth="2" />
            <path d="M32 12 L36 24 L48 24 L38 32 L42 44 L32 36 L22 44 L26 32 L16 24 L28 24 Z"
              fill="#C9973A" opacity="0.9" />
          </svg>
        </div>

        <h1 className="welcome-title">
          Bienvenido a PureLife
        </h1>

        {memberNumber && (
          <p className="member-number">
            Founding Member #{String(memberNumber).padStart(3, '0')}
          </p>
        )}

        <p className="welcome-subtitle">
          Eres parte del grupo original que hace esto posible.<br />
          Acceso completo activado.
        </p>

        <div className="benefits-list">
          <div className="benefit">✦ Dr. Smoothie AI — sin límites</div>
          <div className="benefit">✦ Video Agent — generación ilimitada</div>
          <div className="benefit">✦ Planes personalizados de bienestar</div>
          <div className="benefit">✦ Precio fundador bloqueado para siempre</div>
        </div>

        <button
          className="cta-btn"
          onClick={() => navigate('/dashboard')}
        >
          Ir a mi Dashboard →
        </button>
      </div>

      <style>{styles}</style>
    </div>
  );
}

const styles = `
  .welcome-screen {
    min-height: 100vh;
    background: #0F1F17;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    font-family: 'DM Sans', sans-serif;
  }

  .verifying-state,
  .error-state {
    text-align: center;
    color: #F5F0E8;
  }

  .pulse-ring {
    width: 48px;
    height: 48px;
    border: 3px solid #C9973A;
    border-radius: 50%;
    margin: 0 auto 16px;
    animation: pulse 1.4s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.5; }
  }

  .success-state {
    text-align: center;
    color: #F5F0E8;
    max-width: 480px;
    animation: fadeUp 0.6s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .founding-badge {
    margin-bottom: 24px;
    animation: glow 2s ease-in-out infinite alternate;
  }

  @keyframes glow {
    from { filter: drop-shadow(0 0 8px rgba(201, 151, 58, 0.4)); }
    to { filter: drop-shadow(0 0 20px rgba(201, 151, 58, 0.8)); }
  }

  .welcome-title {
    font-family: 'Fraunces', serif;
    font-size: 36px;
    font-weight: 700;
    color: #F5F0E8;
    margin: 0 0 8px;
    line-height: 1.2;
  }

  .member-number {
    font-size: 14px;
    color: #C9973A;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin: 0 0 16px;
    font-weight: 600;
  }

  .welcome-subtitle {
    font-size: 16px;
    color: rgba(245, 240, 232, 0.7);
    line-height: 1.6;
    margin: 0 0 32px;
  }

  .benefits-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 36px;
    text-align: left;
  }

  .benefit {
    font-size: 15px;
    color: rgba(245, 240, 232, 0.9);
    padding: 12px 16px;
    background: rgba(201, 151, 58, 0.08);
    border: 1px solid rgba(201, 151, 58, 0.2);
    border-radius: 8px;
  }

  .cta-btn {
    width: 100%;
    padding: 16px 24px;
    background: #C9973A;
    color: #0F1F17;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'DM Sans', sans-serif;
  }

  .cta-btn:hover {
    background: #f0c060;
    transform: translateY(-1px);
  }
`;
