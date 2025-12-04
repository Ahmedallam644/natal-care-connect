import { useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  User,
  Bell,
  Shield,
  Database,
  LogOut,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { language } = useLanguage();
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {language === 'ar' ? 'إعدادات النظام' : 'System Settings'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'ar' ? 'إدارة إعدادات النظام والحساب' : 'Manage system and account settings'}
          </p>
        </div>

        {/* Admin Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'حساب المدير' : 'Admin Account'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-info/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-info" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{profile?.full_name}</p>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
                <p className="text-sm text-info">{language === 'ar' ? 'مدير النظام' : 'System Administrator'}</p>
              </div>
            </div>
            
            <div className="grid gap-4 pt-4">
              <div>
                <Label>{language === 'ar' ? 'الاسم' : 'Name'}</Label>
                <Input value={profile?.full_name || ''} disabled className="mt-1" />
              </div>
              <div>
                <Label>{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
                <Input value={profile?.email || ''} disabled className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'إعدادات النظام' : 'System Settings'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {language === 'ar' ? 'تنبيهات النظام' : 'System Alerts'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' 
                    ? 'استلام تنبيهات عن أحداث النظام المهمة'
                    : 'Receive alerts about important system events'
                  }
                </p>
              </div>
              <Switch checked={systemAlerts} onCheckedChange={setSystemAlerts} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {language === 'ar' ? 'وضع الصيانة' : 'Maintenance Mode'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' 
                    ? 'تفعيل وضع الصيانة يمنع المستخدمين من الوصول'
                    : 'Enable maintenance mode to prevent user access'
                  }
                </p>
              </div>
              <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'الإشعارات' : 'Notifications'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {language === 'ar' ? 'تسجيلات جديدة' : 'New Registrations'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'إشعارات عند تسجيل مستخدمين جدد' : 'Notifications for new user registrations'}
                </p>
              </div>
              <Switch checked={true} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {language === 'ar' ? 'أخطاء النظام' : 'System Errors'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'إشعارات فورية عند حدوث أخطاء' : 'Immediate notifications for errors'}
                </p>
              </div>
              <Switch checked={true} />
            </div>
          </CardContent>
        </Card>

        {/* Database Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'معلومات قاعدة البيانات' : 'Database Info'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-secondary/30">
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'نوع قاعدة البيانات' : 'Database Type'}
                </p>
                <p className="font-semibold">PostgreSQL</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30">
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </p>
                <p className="font-semibold text-green-500">
                  {language === 'ar' ? 'متصل' : 'Connected'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Card>
          <CardContent className="p-4">
            <Button
              variant="destructive"
              className="w-full gap-2"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              {language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
