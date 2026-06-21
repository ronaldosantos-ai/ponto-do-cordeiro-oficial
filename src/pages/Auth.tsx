import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const V2_URL = "https://ponto-do-cordeiro-oficial-git-v2-ronaldo-santos-projects.vercel.app";

export default function Auth() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signIn } = useAuth();

  const [mode, setMode]           = useState<'login'|'signup'|'forgot'|'nova_senha'>('login');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirma, setConfirma]   = useState('');
  const [nome, setNome]           = useState('');
  const [loading, setLoading]     = useState(false);
  const [erro, setErro]           = useState<string | null>(null);
  const [msg, setMsg]             = useState<string | null>(null);

  // Detectar evento PASSWORD_RECOVERY quando usuário chega pelo link do email
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMode('nova_senha');
      }
      if (event === 'SIGNED_IN' && mode !== 'nova_senha') {
        navigate('/dashboard', { replace: true });
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Redirecionar se já logado
  useEffect(() => {
    if (!authLoading && user && mode !== 'nova_senha') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, authLoading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setMsg(null);
    setLoading(true);

    try {
      // ── Nova senha após reset ──────────────────────────────
      if (mode === 'nova_senha') {
        if (!novaSenha) { setErro('Digite a nova senha'); setLoading(false); return; }
        if (novaSenha !== confirma) { setErro('As senhas não coincidem'); setLoading(false); return; }
        if (novaSenha.length < 6) { setErro('Senha deve ter pelo menos 6 caracteres'); setLoading(false); return; }

        const { error } = await supabase.auth.updateUser({ password: novaSenha });
        if (error) throw error;
        setMsg('Senha redefinida com sucesso!');
        setTimeout(() => navigate('/dashboard', { replace: true }), 1500);
        return;
      }

      if (!email.trim()) { setErro('Email obrigatório'); setLoading(false); return; }

      // ── Recuperar senha ───────────────────────────────────
      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: V2_URL + '/auth',
        });
        if (error) throw error;
        setMsg('Email enviado! Verifique sua caixa de entrada e clique no link.');
        setMode('login');
        return;
      }

      if (!password) { setErro('Senha obrigatória'); setLoading(false); return; }

      // ── Cadastro ──────────────────────────────────────────
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: nome.trim() || null },
            emailRedirectTo: V2_URL + '/dashboard',
          },
        });
        if (error) throw error;
        setMsg('Conta criada! Verifique seu email para confirmar o cadastro.');
        return;
      }

      // ── Login ─────────────────────────────────────────────
      const { error } = await signIn(email.trim(), password);
      if (error) throw error;
      navigate('/dashboard', { replace: true });

    } catch (e: any) {
      const m = e?.message ?? '';
      if (m.includes('Invalid login'))           setErro('Email ou senha incorretos');
      else if (m.includes('already registered')) setErro('Email já cadastrado');
      else if (m.includes('Email not confirmed')) setErro('Confirme seu email antes de entrar');
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
            {mode === 'login'      ? 'Entre na sua conta'        :
             mode === 'signup'     ? 'Crie sua conta gratuita'   :
             mode === 'forgot'     ? 'Recuperar senha'           :
             'Criar nova senha'}
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

          {/* Nova senha */}
          {mode === 'nova_senha' && (
            <>
              <input className="field" type="password" placeholder="Nova senha (mín. 6 caracteres)"
                value={novaSenha} onChange={e => setNovaSenha(e.target.value)}
                autoComplete="new-password" />
              <input className="field" type="password" placeholder="Confirmar nova senha"
                value={confirma} onChange={e => setConfirma(e.target.value)}
                autoComplete="new-password" />
            </>
          )}

          {/* Campos normais */}
          {mode !== 'nova_senha' && (
            <>
              {mode === 'signup' && (
                <input className="field" type="text" placeholder="Nome completo"
                  value={nome} onChange={e => setNome(e.target.value)}
                  autoComplete="name" />
              )}
              <input className="field" type="email" placeholder="Email"
                value={email} onChange={e => setEmail(e.target.value)}
                autoComplete="email" />
              {mode !== 'forgot' && (
                <input className="field" type="password" placeholder="Senha"
                  value={password} onChange={e => setPassword(e.target.value)}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
              )}
            </>
          )}

          <button type="submit" className="btn-primary"
            disabled={loading} style={{ opacity: loading ? 0.7 : 1, marginTop: 4 }}>
            {loading ? 'Aguarde...' :
             mode === 'login'      ? 'Entrar'                       :
             mode === 'signup'     ? 'Criar conta'                  :
             mode === 'forgot'     ? 'Enviar email de recuperação'  :
             'Salvar nova senha'}
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
          {(mode === 'signup' || mode === 'forgot') && (
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
