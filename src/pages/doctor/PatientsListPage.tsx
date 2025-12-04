import { DoctorLayout } from '@/components/layouts/DoctorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Users,
  Search,
  User,
  Calendar,
  Activity,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { RiskBadge } from '@/components/RiskBadge';

export default function PatientsListPage() {
  const { language, isRTL } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

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

  // Fetch patients
  const { data: patients, isLoading } = useQuery({
    queryKey: ['doctor-patients', doctor?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*, pregnancy_history (*), ai_risk_scores (*)')
        .eq('linked_doctor_id', doctor?.id);
      if (error) throw error;
      
      // Fetch profiles separately
      const userIds = data?.map(p => p.user_id) || [];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, email, phone')
        .in('user_id', userIds);
      
      return data?.map(p => ({
        ...p,
        profile: profiles?.find(pr => pr.user_id === p.user_id)
      }));
    },
    enabled: !!doctor?.id,
  });

  const filteredPatients = patients?.filter((p: any) => 
    p.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.profile?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <DoctorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {language === 'ar' ? 'قائمة المريضات' : 'Patients List'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? `${patients?.length || 0} مريضة مسجلة`
                : `${patients?.length || 0} registered patients`
              }
            </p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Patients List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'المريضات' : 'Patients'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
              </div>
            ) : filteredPatients && filteredPatients.length > 0 ? (
              <div className="space-y-3">
                    {filteredPatients.map((patient: any) => {
                      const currentPregnancy = patient.pregnancy_history?.find((p: any) => p.is_current);
                      const latestRisk = patient.ai_risk_scores?.[0];
                      
                      return (
                        <button
                          key={patient.id}
                          onClick={() => navigate(`/doctor/patients/${patient.id}`)}
                          className="w-full p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all text-start"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <User className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-foreground truncate">
                                  {patient.profile?.full_name}
                                </h3>
                                {latestRisk && (
                                  <RiskBadge level={latestRisk.overall_risk_level as any} />
                                )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            {currentPregnancy?.expected_due_date && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {currentPregnancy.expected_due_date}
                              </span>
                            )}
                            {patient.blood_type && (
                              <span className="flex items-center gap-1">
                                <Activity className="h-3 w-3" />
                                {patient.blood_type}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>{language === 'ar' ? 'لا توجد مريضات مسجلات' : 'No patients registered'}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DoctorLayout>
  );
}
