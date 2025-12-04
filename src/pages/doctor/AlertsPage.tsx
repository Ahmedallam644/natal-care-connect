import { DoctorLayout } from '@/components/layouts/DoctorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  AlertTriangle,
  AlertCircle,
  Bell,
  User,
  Activity,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { RiskBadge } from '@/components/RiskBadge';

export default function AlertsPage() {
  const { language, isRTL } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  // Fetch doctor data
  const { data: doctor } = useQuery({
    queryKey: ['doctor', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch high-risk patients
  const { data: alerts, isLoading } = useQuery({
    queryKey: ['doctor-alerts', doctor?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_risk_scores')
        .select(`
          *,
          patients!inner (
            id,
            linked_doctor_id,
            profiles:user_id (full_name)
          )
        `)
        .eq('patients.linked_doctor_id', doctor?.id)
        .in('overall_risk_level', ['high', 'critical'])
        .order('calculated_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!doctor?.id,
  });

  const criticalAlerts = alerts?.filter(a => a.overall_risk_level === 'critical') || [];
  const highAlerts = alerts?.filter(a => a.overall_risk_level === 'high') || [];

  return (
    <DoctorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {language === 'ar' ? 'التنبيهات والمخاطر' : 'Alerts & Risks'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'ar' 
              ? 'مراقبة المريضات ذوات المخاطر العالية'
              : 'Monitor high-risk patients'
            }
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-red-500/10 border-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-red-500">{criticalAlerts.length}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'حالات حرجة' : 'Critical'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-orange-500/10 border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-orange-500">{highAlerts.length}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'مخاطر عالية' : 'High Risk'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Critical Alerts */}
        {criticalAlerts.length > 0 && (
          <Card className="border-red-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="h-5 w-5" />
                {language === 'ar' ? 'حالات حرجة تحتاج اهتمام فوري' : 'Critical Cases - Immediate Attention Required'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {criticalAlerts.map(alert => (
                <button
                  key={alert.id}
                  onClick={() => navigate(`/doctor/patients/${alert.patients.id}`)}
                  className="w-full p-4 rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 transition-all text-start"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                      <User className="h-6 w-6 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {alert.patients.profiles?.full_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(alert.calculated_at), 'PPp', { locale: isRTL ? ar : undefined })}
                      </p>
                    </div>
                    <RiskBadge level="critical" />
                    <ChevronIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* High Risk Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              {language === 'ar' ? 'حالات عالية المخاطر' : 'High Risk Cases'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
              </div>
            ) : highAlerts.length > 0 ? (
              <div className="space-y-3">
                {highAlerts.map(alert => (
                  <button
                    key={alert.id}
                    onClick={() => navigate(`/doctor/patients/${alert.patients.id}`)}
                    className="w-full p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all text-start"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-orange-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {alert.patients.profiles?.full_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(alert.calculated_at), 'PPp', { locale: isRTL ? ar : undefined })}
                        </p>
                      </div>
                      <RiskBadge level="high" />
                      <ChevronIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>{language === 'ar' ? 'لا توجد تنبيهات حالياً' : 'No alerts currently'}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DoctorLayout>
  );
}
