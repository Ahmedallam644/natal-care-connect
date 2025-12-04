import { DoctorLayout } from '@/components/layouts/DoctorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  User,
  Calendar,
  Activity,
  Baby,
  TestTube,
  ClipboardList,
  ArrowRight,
  ArrowLeft,
  Phone,
  Mail,
} from 'lucide-react';
import { RiskBadge } from '@/components/RiskBadge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PatientDetailPage() {
  const { language, isRTL } = useLanguage();
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;

  // Fetch patient data
  const { data: patient, isLoading } = useQuery({
    queryKey: ['patient-detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          profiles:user_id (full_name, email, phone),
          pregnancy_history (*),
          fmc_records (*),
          symptoms (*),
          lab_orders (*),
          ai_risk_scores (*)
        `)
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const currentPregnancy = patient?.pregnancy_history?.find((p: any) => p.is_current);
  const latestRisk = patient?.ai_risk_scores?.[0];
  
  // Prepare FMC chart data
  const fmcData = patient?.fmc_records
    ?.slice(0, 14)
    .reverse()
    .map((record: any) => ({
      date: format(new Date(record.recorded_at), 'MM/dd'),
      kicks: record.kick_count,
    })) || [];

  if (isLoading) {
    return (
      <DoctorLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/doctor/patients')} className="gap-2">
          <ArrowIcon className="h-4 w-4" />
          {language === 'ar' ? 'العودة للقائمة' : 'Back to List'}
        </Button>

        {/* Patient Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-foreground">
                    {patient?.profiles?.full_name}
                  </h1>
                  {latestRisk && <RiskBadge level={latestRisk.overall_risk_level} />}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {patient?.profiles?.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {patient.profiles.email}
                    </span>
                  )}
                  {patient?.profiles?.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {patient.profiles.phone}
                    </span>
                  )}
                  {patient?.blood_type && (
                    <Badge variant="outline">{patient.blood_type}</Badge>
                  )}
                </div>
              </div>
              {currentPregnancy?.expected_due_date && (
                <div className="text-center p-4 rounded-xl bg-primary/10">
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'تاريخ الولادة المتوقع' : 'Expected Due Date'}
                  </p>
                  <p className="text-lg font-bold text-primary">
                    {format(new Date(currentPregnancy.expected_due_date), 'PP', { locale: isRTL ? ar : undefined })}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview">{language === 'ar' ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
            <TabsTrigger value="fmc">{language === 'ar' ? 'حركة الجنين' : 'FMC'}</TabsTrigger>
            <TabsTrigger value="symptoms">{language === 'ar' ? 'الأعراض' : 'Symptoms'}</TabsTrigger>
            <TabsTrigger value="labs">{language === 'ar' ? 'التحاليل' : 'Labs'}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Risk Scores */}
            {latestRisk && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    {language === 'ar' ? 'تقييم المخاطر' : 'Risk Assessment'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                      { key: 'preeclampsia_risk', labelAr: 'تسمم الحمل', labelEn: 'Preeclampsia' },
                      { key: 'gestational_diabetes_risk', labelAr: 'سكري الحمل', labelEn: 'Gestational Diabetes' },
                      { key: 'anemia_risk', labelAr: 'فقر الدم', labelEn: 'Anemia' },
                      { key: 'preterm_birth_risk', labelAr: 'الولادة المبكرة', labelEn: 'Preterm Birth' },
                      { key: 'fetal_growth_restriction_risk', labelAr: 'تقييد النمو', labelEn: 'Growth Restriction' },
                    ].map(risk => (
                      <div key={risk.key} className="text-center p-3 rounded-lg bg-secondary/30">
                        <p className="text-2xl font-bold text-foreground">
                          {latestRisk[risk.key] ? `${(latestRisk[risk.key] * 100).toFixed(0)}%` : 'N/A'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {language === 'ar' ? risk.labelAr : risk.labelEn}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Baby className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{patient?.fmc_records?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'سجلات حركة الجنين' : 'FMC Records'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <ClipboardList className="h-8 w-8 mx-auto mb-2 text-accent" />
                  <p className="text-2xl font-bold">{patient?.symptoms?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'الأعراض المسجلة' : 'Symptoms'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <TestTube className="h-8 w-8 mx-auto mb-2 text-info" />
                  <p className="text-2xl font-bold">{patient?.lab_orders?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'التحاليل' : 'Lab Orders'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold">{patient?.pregnancy_history?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'عدد الأحمال' : 'Pregnancies'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="fmc" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'رسم حركة الجنين' : 'Fetal Movement Chart'}</CardTitle>
              </CardHeader>
              <CardContent>
                {fmcData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={fmcData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="kicks" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    {language === 'ar' ? 'لا توجد بيانات' : 'No data available'}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="symptoms" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'الأعراض الأخيرة' : 'Recent Symptoms'}</CardTitle>
              </CardHeader>
              <CardContent>
                {patient?.symptoms && patient.symptoms.length > 0 ? (
                  <div className="space-y-2">
                    {patient.symptoms.slice(0, 10).map((symptom: any) => (
                      <div key={symptom.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                        <span className="font-medium">{symptom.symptom_type}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {language === 'ar' ? `شدة ${symptom.severity}` : `Severity ${symptom.severity}`}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(symptom.recorded_at), 'PP', { locale: isRTL ? ar : undefined })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    {language === 'ar' ? 'لا توجد أعراض مسجلة' : 'No symptoms recorded'}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="labs" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'التحاليل المطلوبة' : 'Lab Orders'}</CardTitle>
              </CardHeader>
              <CardContent>
                {patient?.lab_orders && patient.lab_orders.length > 0 ? (
                  <div className="space-y-2">
                    {patient.lab_orders.map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                        <span className="font-medium">
                          {language === 'ar' ? order.test_name_ar : order.test_name_en}
                        </span>
                        <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    {language === 'ar' ? 'لا توجد تحاليل' : 'No lab orders'}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DoctorLayout>
  );
}
