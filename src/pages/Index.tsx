import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Heart, Stethoscope, Shield, ArrowRight, ArrowLeft, Activity, Baby, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Index() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && profile) {
      // Redirect based on role
      switch (profile.role) {
        case 'patient':
          navigate('/patient/dashboard');
          break;
        case 'doctor':
          navigate('/doctor/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
      }
    }
  }, [user, profile, loading, navigate]);

  const features = [
    {
      icon: Baby,
      title: 'متابعة حركة الجنين',
      titleEn: 'Fetal Movement Tracking',
      description: 'تتبعي حركات جنينك بسهولة',
      descriptionEn: 'Track your baby movements easily',
    },
    {
      icon: Activity,
      title: 'تحليل المخاطر بالذكاء الاصطناعي',
      titleEn: 'AI Risk Analysis',
      description: 'كشف مبكر للمخاطر الصحية',
      descriptionEn: 'Early detection of health risks',
    },
    {
      icon: ClipboardList,
      title: 'إدارة التحاليل المخبرية',
      titleEn: 'Lab Test Management',
      description: 'طلب ورفع نتائج التحاليل',
      descriptionEn: 'Order and upload lab results',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background" dir="rtl">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">رعاية الحمل</span>
          </div>
          <Button variant="hero" onClick={() => navigate('/auth')}>
            تسجيل الدخول
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Activity className="h-4 w-4" />
              منصة ذكية للفحص والكشف المبكر
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              رعاية شاملة لصحة
              <span className="text-gradient-primary"> الأم والجنين</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              منصة متكاملة تربط بينك وبين طبيبك لمتابعة حملك بأمان، مع تحليل ذكي للمخاطر الصحية
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" onClick={() => navigate('/auth')}>
                ابدئي الآن مجاناً
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="xl">
                تعرفي على المزيد
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className="healthcare-card p-6 text-center animate-fade-in"
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Cards */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            من أنتِ؟
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Heart,
                role: 'مريضة',
                description: 'تتبعي حملك وتواصلي مع طبيبك',
                color: 'from-accent to-accent/80',
                textColor: 'text-accent',
              },
              {
                icon: Stethoscope,
                role: 'طبيب',
                description: 'تابعي مريضاتك وأدري المخاطر',
                color: 'from-primary to-primary/80',
                textColor: 'text-primary',
              },
              {
                icon: Shield,
                role: 'مدير',
                description: 'أدر النظام والإعدادات',
                color: 'from-info to-info/80',
                textColor: 'text-info',
              },
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => navigate('/auth')}
                className="healthcare-card p-8 text-center hover:shadow-healthcare-lg transition-all group"
              >
                <div
                  className={cn(
                    'w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform',
                    item.color
                  )}
                >
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className={cn('text-xl font-bold mb-2', item.textColor)}>{item.role}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 رعاية الحمل. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
