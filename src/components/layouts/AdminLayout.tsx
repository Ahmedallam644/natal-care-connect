import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  Hospital,
  TestTube,
  FileText,
  Cpu,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Shield,
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { profile, signOut } = useAuth();
  const { language, isRTL } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/admin/dashboard', label: language === 'ar' ? 'لوحة التحكم' : 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/doctors', label: language === 'ar' ? 'الأطباء' : 'Doctors', icon: Users },
    { path: '/admin/hospitals', label: language === 'ar' ? 'المستشفيات' : 'Hospitals', icon: Hospital },
    { path: '/admin/lab-categories', label: language === 'ar' ? 'فئات التحاليل' : 'Lab Categories', icon: TestTube },
    { path: '/admin/reports', label: language === 'ar' ? 'التقارير' : 'Reports', icon: FileText },
    { path: '/admin/ai-config', label: language === 'ar' ? 'إعدادات الذكاء' : 'AI Config', icon: Cpu },
    { path: '/admin/settings', label: language === 'ar' ? 'الإعدادات' : 'Settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="flex items-center justify-between px-4 h-16">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-info" />
            <span className="font-semibold">{language === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'}</span>
          </div>
          
          <LanguageToggle />
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 h-full w-72 bg-sidebar border-e border-sidebar-border z-40 transition-transform duration-300 lg:translate-x-0',
          isRTL ? 'right-0' : 'left-0',
          sidebarOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-sidebar-border">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-info to-info/80 flex items-center justify-center">
            <Shield className="h-5 w-5 text-info-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-sidebar-foreground">
              {language === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'}
            </h1>
            <p className="text-xs text-muted-foreground">{language === 'ar' ? 'مدير' : 'Admin'}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                location.pathname === item.path
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center">
              <span className="text-info font-medium">
                {profile?.full_name?.[0] || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {profile?.full_name || 'Admin'}
              </p>
              <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          'pt-16 lg:pt-0 min-h-screen transition-all duration-300',
          isRTL ? 'lg:mr-72' : 'lg:ml-72'
        )}
      >
        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between px-8 h-16 border-b border-border bg-card">
          <div>
            <h2 className="font-semibold text-foreground">
              {language === 'ar' ? 'مرحباً' : 'Welcome'}, {profile?.full_name || 'Admin'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
