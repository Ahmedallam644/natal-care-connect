import { useState } from 'react';
import { PatientLayout } from '@/components/layouts/PatientLayout';
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
import {
  Settings,
  User,
  Bell,
  Shield,
  Link2,
  Save,
  LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { isRTL } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [doctorCode, setDoctorCode] = useState('');
  const [notifications, setNotifications] = useState(true);

  // Fetch patient data
  const { data: patient } = useQuery({
    queryKey: ['patient', user?.id],
    queryFn: async () => {
      const { data: patientData, error } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      
      if (patientData?.linked_doctor_id) {
        const { data: doctorData } = await supabase
          .from('doctors')
          .select('user_id')
          .eq('id', patientData.linked_doctor_id)
          .single();
        if (doctorData) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', doctorData.user_id)
            .single();
          return { ...patientData, doctor_name: profile?.full_name };
        }
      }
      return patientData;
    },
    enabled: !!user?.id,
  });

  // Link doctor mutation
  const linkDoctor = useMutation({
    mutationFn: async (code: string) => {
      // Find the doctor code
      const { data: codeData, error: codeError } = await supabase
        .from('doctor_codes')
        .select('doctor_id')
        .eq('code', code)
        .eq('is_active', true)
        .single();
      
      if (codeError || !codeData) {
        throw new Error(isRTL ? 'كود غير صالح' : 'Invalid code');
      }

      // Update patient's linked doctor
      const { error: updateError } = await supabase
        .from('patients')
        .update({ linked_doctor_id: codeData.doctor_id })
        .eq('user_id', user?.id);
      
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient'] });
      setDoctorCode('');
      toast.success(isRTL ? 'تم الربط بالطبيب بنجاح' : 'Successfully linked to doctor');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <PatientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isRTL ? 'الإعدادات' : 'Settings'}
          </h1>
          <p className="text-muted-foreground">
            {isRTL ? 'إدارة حسابك وإعداداتك' : 'Manage your account and preferences'}
          </p>
        </div>

        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {isRTL ? 'الملف الشخصي' : 'Profile'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {profile?.full_name?.[0] || 'م'}
                </span>
              </div>
              <div>
                <p className="font-semibold text-foreground">{profile?.full_name}</p>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
              </div>
            </div>
            
            <div className="grid gap-4 pt-4">
              <div>
                <Label>{isRTL ? 'الاسم الكامل' : 'Full Name'}</Label>
                <Input value={profile?.full_name || ''} disabled className="mt-1" />
              </div>
              <div>
                <Label>{isRTL ? 'البريد الإلكتروني' : 'Email'}</Label>
                <Input value={profile?.email || ''} disabled className="mt-1" />
              </div>
              <div>
                <Label>{isRTL ? 'رقم الهاتف' : 'Phone'}</Label>
                <Input value={profile?.phone || ''} disabled className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Link Doctor Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-primary" />
              {isRTL ? 'ربط الطبيب' : 'Link Doctor'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {patient?.linked_doctor_id ? (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-green-600 font-medium">
                  {isRTL ? 'مرتبطة بـ:' : 'Linked to:'} {patient.doctor_name || (isRTL ? 'طبيب' : 'Doctor')}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {isRTL 
                    ? 'أدخلي كود الطبيب للربط بحسابه ومشاركة بياناتك الصحية'
                    : 'Enter your doctor\'s code to link and share your health data'
                  }
                </p>
                <div className="flex gap-2">
                  <Input
                    value={doctorCode}
                    onChange={(e) => setDoctorCode(e.target.value.toUpperCase())}
                    placeholder={isRTL ? 'أدخلي الكود' : 'Enter code'}
                    className="flex-1"
                    maxLength={8}
                  />
                  <Button 
                    onClick={() => linkDoctor.mutate(doctorCode)}
                    disabled={!doctorCode || linkDoctor.isPending}
                  >
                    {linkDoctor.isPending 
                      ? (isRTL ? 'جاري الربط...' : 'Linking...')
                      : (isRTL ? 'ربط' : 'Link')
                    }
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              {isRTL ? 'الإشعارات' : 'Notifications'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{isRTL ? 'تفعيل الإشعارات' : 'Enable Notifications'}</p>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? 'استلام تنبيهات التحاليل والمواعيد' : 'Receive alerts for tests and appointments'}
                </p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
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
              {isRTL ? 'تسجيل الخروج' : 'Sign Out'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </PatientLayout>
  );
}
