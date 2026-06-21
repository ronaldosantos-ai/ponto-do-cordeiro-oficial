import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { emailSchema, passwordSchema } from '@/lib/validations';

type AuthMode = 'login' | 'signup' | 'forgot';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading, signIn, signUp, resetPassword } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const V2_URL = 'https://ponto-do-cordeiro-oficial-git-v2-ronaldo-santos-projects.vercel.app/dashboard';

  // Redirect if already logged in → V2 (nova plataforma)
  useEffect(() => {
    if (!authLoading && user) {
      window.location.href = V2_URL;
    }
  }, [user, authLoading]);

  const validateEmail = (value: string): string | null => {
    const result = emailSchema.safeParse(value);
    if (!result.success) {
      return result.error.errors[0]?.message || "Email inválido";
    }
    return null;
  };

  const validatePassword = (value: string): string | null => {
    const result = passwordSchema.safeParse(value);
    if (!result.success) {
      return result.error.errors[0]?.message || "Senha inválida";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de email com Zod
    const emailError = validateEmail(email);
    if (emailError) {
      toast({
        title: "❌ Email inválido",
        description: emailError,
        variant: "destructive"
      });
      return;
    }

    // Modo recuperação de senha
    if (mode === 'forgot') {
      setLoading(true);
      try {
        const { error } = await resetPassword(email.trim());
        
        if (error) {
          toast({
            title: "❌ Erro",
            description: "Não foi possível enviar o email de recuperação",
            variant: "destructive"
          });
          return;
        }

        toast({ 
          title: "✅ Email enviado!",
          description: "Verifique sua caixa de entrada para redefinir a senha"
        });
        setMode('login');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Validação de senha com Zod
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast({
        title: "❌ Senha inválida",
        description: passwordError,
        variant: "destructive"
      });
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      toast({
        title: "❌ Senhas não conferem",
        description: "As senhas digitadas são diferentes",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email.trim(), password);
        
        if (error) {
          let message = "Erro ao fazer login";
          if (error.message.includes("Invalid login credentials")) {
            message = "Email ou senha incorretos";
          } else if (error.message.includes("Email not confirmed")) {
            message = "Email não confirmado. Verifique sua caixa de entrada.";
          }
          
          toast({
            title: "❌ Erro no login",
            description: message,
            variant: "destructive"
          });
          return;
        }

        toast({ title: "✅ Login realizado com sucesso!" });
        navigate('/premium');
      } else {
        const { error } = await signUp(email.trim(), password);
        
        if (error) {
          let message = "Erro ao criar conta";
          if (error.message.includes("already registered")) {
            message = "Este email já está cadastrado. Faça login.";
          }
          
          toast({
            title: "❌ Erro no cadastro",
            description: message,
            variant: "destructive"
          });
          return;
        }

        toast({ 
          title: "✅ Conta criada com sucesso!",
          description: "Você já pode usar o app"
        });
        navigate('/premium');
      }
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Algo deu errado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getModeTitle = () => {
    switch (mode) {
      case 'login': return 'Entre na sua conta';
      case 'signup': return 'Crie sua conta';
      case 'forgot': return 'Recuperar senha';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="page-container min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="p-2 hover:bg-secondary"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </Button>
      </header>

      {/* Logo */}
      <div className="text-center mb-8">
        <img 
          src="/icon.png" 
          alt="Ponto do Cordeiro" 
          className="w-20 h-20 rounded-2xl mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-foreground">Ponto do Cordeiro</h1>
        <p className="text-muted-foreground mt-1">{getModeTitle()}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto w-full">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12"
            required
          />
        </div>

        {mode !== 'forgot' && (
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-12"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {mode === 'signup' && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10 h-12"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {mode === 'login' && (
          <div className="text-right">
            <button
              type="button"
              onClick={() => setMode('forgot')}
              className="text-sm text-primary hover:underline"
            >
              Esqueci minha senha
            </button>
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-12 bg-primary hover:bg-primary/90"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : mode === 'login' ? 'Entrar' : mode === 'signup' ? 'Criar Conta' : 'Enviar email'}
        </Button>

      </form>

      {/* Toggle */}
      <div className="text-center mt-6">
        {mode === 'forgot' ? (
          <p className="text-muted-foreground">
            Lembrou a senha?
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-primary font-semibold ml-1 hover:underline"
            >
              Fazer login
            </button>
          </p>
        ) : (
          <p className="text-muted-foreground">
            {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setPassword('');
                setConfirmPassword('');
              }}
              className="text-primary font-semibold ml-1 hover:underline"
            >
              {mode === 'login' ? 'Criar conta' : 'Fazer login'}
            </button>
          </p>
        )}
      </div>

      {/* Info */}
      <div className="mt-8 p-4 bg-secondary/50 rounded-lg text-center max-w-sm mx-auto">
        <p className="text-sm text-muted-foreground">
          🔄 Com uma conta, suas simulações ficam sincronizadas em todos os dispositivos
        </p>
      </div>
    </div>
  );
};

export default Auth;
