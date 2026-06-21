import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export default function Auth() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode]       = useState<'login'|'signup'|'forgot'>('login');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome]       = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro]       = useState<string | null>(null);
  const [msg, setMsg]         = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) navigate('/dashboard', { replace: true });
  }, [user, authLoading, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setMsg(null);
    if (!email.trim()) { setErro('Email obrigatório'); return; }

    setLoading(true);
    try {
      if (mode === 'forgot') {
        const { error } = await resetPassword(email.trim());
        if (error) throw error;
        setMsg('Email de recuperação enviado. Verifique sua caixa de entrada.');
        setMode('login');
        return;
      }

      if (!password) { setErro('Senha obrigatória'); return; }

      if (mode === 'signup') {
        // Cadastro com nome completo
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: nome.trim() || null },
            emailRedirectTo: window.location.origin + '/dashboard',
          },
        });
        if (error) throw error;
        setMsg('Conta criada! Verifique seu email para confirmar o cadastro.');
      } else {
        const { error } = await signIn(email.trim(), password);
        if (error) throw error;
        navigate('/dashboard', { replace: true });
      }
    } catch (e: any) {
      const m = e?.message ?? '';
      if (m.includes('Invalid login'))       setErro('Email ou senha incorretos');
      else if (m.includes('already registered')) setErro('Email já cadastrado');
      else setErro(m || 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) return (
    <div style={{ minHeight: '100vh', background: 'hsl(100,20%,9%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 12 }}>
      <span style={{ fontSize: 32 }}>🐑</span>
      <p style={{ fontSize: 14, color: 'hsl(100,18%,45%)' }}>Carregando...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'hsl(100,20%,9%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px' }}>
      <div style={{ width: '100%', maxWidth: 380 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <p style={{ fontSize: 36, marginBottom: 8 }}>🐑</p>
          <p style={{ fontSize: 20, fontWeight: 600, color: 'hsl(113,48%,62%)' }}>
            Ponto do Cordeiro
          </p>
          <p style={{ fontSize: 13, color: 'hsl(100,18%,45%)', marginTop: 4 }}>
            {mode === 'login'  ? 'Entre na sua conta' :
             mode === 'signup' ? 'Crie sua conta gratuita' :
             'Recuperar senha'}
          </p>
        </div>

        {/* Mensagens */}
        {erro && (
          <div style={{ background: 'hsl(0,65%,12%)', border: '0.5px solid hsl(0,65%,30%)',
            borderRadius: 10, padding: '12px 14px', marginBottom: 16,
            color: 'hsl(0,65%,62%)', fontSize: 13 }}>{erro}</div>
        )}
        {msg && (
          <div style={{ background: 'hsl(113,48%,10%)', border: '0.5px solid hsl(113,48%,30%)',
            borderRadius: 10, padding: '12px 14px', marginBottom: 16,
            color: 'hsl(113,48%,62%)', fontSize: 13 }}>{msg}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Nome completo — só no cadastro */}
          {mode === 'signup' && (
            <input
              className="field"
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={e => setNome(e.target.value)}
              autoComplete="name"
            />
          )}

          <input
            className="field"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />

          {mode !== 'forgot' && (
            <input
              className="field"
              type="password"
              placeholder="Senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          )}

          <button type="submit" className="btn-primary"
            disabled={loading} style={{ opacity: loading ? 0.7 : 1, marginTop: 4 }}>
            {loading ? 'Aguarde...' :
             mode === 'login'  ? 'Entrar' :
             mode === 'signup' ? 'Criar conta' :
             'Enviar email de recuperação'}
          </button>
        </form>

        {/* Links */}
        <div style={{ textAlign: 'center', marginTop: 20,
          display: 'flex', flexDirection: 'column', gap: 10 }}>
          {mode === 'login' && (
            <>
              <button onClick={() => { setMode('forgot'); setErro(null); setMsg(null); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer',
                  color: 'hsl(100,18%,45%)', fontSize: 13 }}>
                Esqueci minha senha
              </button>
              <button onClick={() => { setMode('signup'); setErro(null); setMsg(null); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer',
                  color: 'hsl(113,48%,55%)', fontSize: 13, fontWeight: 500 }}>
                Criar conta gratuita
              </button>
            </>
          )}
          {mode !== 'login' && (
            <button onClick={() => { setMode('login'); setErro(null); setMsg(null); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer',
                color: 'hsl(100,18%,45%)', fontSize: 13 }}>
              Voltar para o login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
