import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Heart, Stethoscope, Shield, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type AuthMode = 'login' | 'signup';
type RoleSelection = 'patient' | 'doctor' | 'admin';

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<RoleSelection>('patient');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: t('error'),
            description: error.message,
            variant: 'destructive',
          });
        } else {
          navigate('/dashboard');
        }
      } else {
        const { error } = await signUp(email, password, { full_name: fullName, role });
        if (error) {
          toast({
            title: t('error'),
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: t('success'),
            description: isRTL ? 'تم إنشاء الحساب بنجاح' : 'Account created successfully',
          });
          navigate('/dashboard');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'patient' as const, label: t('patient'), icon: Heart, color: 'text-accent' },
    { value: 'doctor' as const, label: t('doctor'), icon: Stethoscope, color: 'text-primary' },
    { value: 'admin' as const, label: t('admin'), icon: Shield, color: 'text-info' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-glow mb-4">
            <Heart className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t('app_name')}</h1>
          <p className="text-muted-foreground mt-2">
            {isRTL ? 'رعاية شاملة لصحة الأم والجنين' : 'Comprehensive maternal and fetal care'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="healthcare-card p-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {/* Mode Toggle */}
          <div className="flex rounded-lg bg-secondary p-1 mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={cn(
                'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
                mode === 'login'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t('login')}
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={cn(
                'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
                mode === 'signup'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t('signup')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                {/* Role Selection */}
                <div className="space-y-2">
                  <Label>{isRTL ? 'نوع الحساب' : 'Account Type'}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {roleOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setRole(option.value)}
                        className={cn(
                          'flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
                          role === option.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/30'
                        )}
                      >
                        <option.icon className={cn('h-5 w-5', option.color)} />
                        <span className="text-xs font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t('full_name')}</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="input-healthcare"
                  />
                </div>
              </>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-healthcare"
                dir="ltr"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="input-healthcare"
                dir="ltr"
              />
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : mode === 'login' ? (
                t('login')
              ) : (
                t('signup')
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
