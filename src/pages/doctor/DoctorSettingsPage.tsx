import { useState } from 'react';
import { DoctorLayout } from '@/components/layouts/DoctorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  User,
  Bell,
  Key,
  Copy,
  RefreshCw,
  LogOut,
} from 'lucide-react';

export default function DoctorSettingsPage() {
  const { language, isRTL } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [notifications, setNotifications] = useState(true);

  // Fetch doctor data with code
  const { data: doctor } = useQuery({
    queryKey: ['doctor-with-code', user?.id],
    queryFn: async () => {
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctors')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      if (doctorError) throw doctorError;

      const { data: codeData } = await supabase
        .from('doctor_codes')
        .select('*')
        .eq('doctor_id', doctorData.id)
        .eq('is_active', true)
        .single();

      return { ...doctorData, code: codeData?.code };
    },
    enabled: !!user?.id,
  });

  // Generate new code
  const generateCode = useMutation({
    mutationFn: async () => {
      if (!doctor?.id) return;
      
      // Deactivate old codes
      await supabase
        .from('doctor_codes')
        .update({ is_active: false })
        .eq('doctor_id', doctor.id);

      // Generate new code
      const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const { error } = await supabase
        .from('doctor_codes')
        .insert({ doctor_id: doctor.id, code: newCode });
      
      if (error) throw error;
      return newCode;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-with-code'] });
      toast.success(language === 'ar' ? 'تم إنشاء كود جديد' : 'New code generated');
    },
    onError: () => {
      toast.error(language === 'ar' ? 'حدث خطأ' : 'Error occurred');
    },
  });

  const copyCode = () => {
    if (doctor?.code) {
      navigator.clipboard.writeText(doctor.code);
      toast.success(language === 'ar' ? 'تم نسخ الكود' : 'Code copied');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <DoctorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {language === 'ar' ? 'الإعدادات' : 'Settings'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'ar' ? 'إدارة حسابك وإعداداتك' : 'Manage your account and preferences'}
          </p>
        </div>

        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {profile?.full_name?.[0] || 'D'}
                </span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Dr. {profile?.full_name}</p>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
                {doctor?.specialty && (
                  <p className="text-sm text-primary">{doctor.specialty}</p>
                )}
              </div>
            </div>
            
            <div className="grid gap-4 pt-4">
              <div>
                <Label>{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</Label>
                <Input value={profile?.full_name || ''} disabled className="mt-1" />
              </div>
              <div>
                <Label>{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
                <Input value={profile?.email || ''} disabled className="mt-1" />
              </div>
              <div>
                <Label>{language === 'ar' ? 'رقم الترخيص' : 'License Number'}</Label>
                <Input value={doctor?.license_number || ''} disabled className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Doctor Code Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'كود الطبيب' : 'Doctor Code'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {language === 'ar' 
                ? 'شاركي هذا الكود مع مريضاتك لربط حساباتهن'
                : 'Share this code with your patients to link their accounts'
              }
            </p>
            
            {doctor?.code ? (
              <div className="flex items-center gap-2">
                <div className="flex-1 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-3xl font-bold text-primary text-center tracking-widest">
                    {doctor.code}
                  </p>
                </div>
                <Button variant="outline" size="icon" onClick={copyCode}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => generateCode.mutate()}
                  disabled={generateCode.isPending}
                >
                  <RefreshCw className={`h-4 w-4 ${generateCode.isPending ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            ) : (
              <Button onClick={() => generateCode.mutate()} disabled={generateCode.isPending}>
                {generateCode.isPending 
                  ? (language === 'ar' ? 'جاري الإنشاء...' : 'Generating...')
                  : (language === 'ar' ? 'إنشاء كود' : 'Generate Code')
                }
              </Button>
            )}
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
                <p className="font-medium">{language === 'ar' ? 'تنبيهات المخاطر' : 'Risk Alerts'}</p>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'استلام تنبيهات عند وجود حالات خطرة' : 'Receive alerts for high-risk cases'}
                </p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{language === 'ar' ? 'رسائل المريضات' : 'Patient Messages'}</p>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'إشعارات الرسائل الجديدة' : 'New message notifications'}
                </p>
              </div>
              <Switch checked={true} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{language === 'ar' ? 'نتائج التحاليل' : 'Lab Results'}</p>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'إشعارات عند رفع نتائج جديدة' : 'Notifications for new results'}
                </p>
              </div>
              <Switch checked={true} />
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
    </DoctorLayout>
  );
}
