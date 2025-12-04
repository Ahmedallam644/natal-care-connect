import { useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Search,
  Plus,
  Stethoscope,
  Mail,
  Phone,
  MoreVertical,
} from 'lucide-react';

export default function ManageDoctorsPage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch doctors
  const { data: doctors, isLoading } = useQuery({
    queryKey: ['admin-doctors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select(`
          *,
          profiles:user_id (full_name, email, phone),
          hospitals (name_ar, name_en)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredDoctors = doctors?.filter(d =>
    d.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {language === 'ar' ? 'إدارة الأطباء' : 'Manage Doctors'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? `${doctors?.length || 0} طبيب مسجل`
                : `${doctors?.length || 0} registered doctors`
              }
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {language === 'ar' ? 'إضافة طبيب' : 'Add Doctor'}
            </Button>
          </div>
        </div>

        {/* Doctors List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'قائمة الأطباء' : 'Doctors List'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
              </div>
            ) : filteredDoctors && filteredDoctors.length > 0 ? (
              <div className="space-y-4">
                {filteredDoctors.map(doctor => (
                  <div
                    key={doctor.id}
                    className="p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Stethoscope className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">
                            Dr. {doctor.profiles?.full_name}
                          </h3>
                          <Badge variant={doctor.is_active ? 'default' : 'secondary'}>
                            {doctor.is_active 
                              ? (language === 'ar' ? 'نشط' : 'Active')
                              : (language === 'ar' ? 'غير نشط' : 'Inactive')
                            }
                          </Badge>
                        </div>
                        {doctor.specialty && (
                          <p className="text-sm text-primary">{doctor.specialty}</p>
                        )}
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                          {doctor.profiles?.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {doctor.profiles.email}
                            </span>
                          )}
                          {doctor.profiles?.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {doctor.profiles.phone}
                            </span>
                          )}
                        </div>
                        {doctor.hospitals && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {language === 'ar' ? doctor.hospitals.name_ar : doctor.hospitals.name_en}
                          </p>
                        )}
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Stethoscope className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>{language === 'ar' ? 'لا يوجد أطباء' : 'No doctors found'}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
