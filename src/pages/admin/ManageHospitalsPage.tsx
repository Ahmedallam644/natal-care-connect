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
  Hospital,
  Search,
  Plus,
  MapPin,
  Phone,
  MoreVertical,
} from 'lucide-react';

export default function ManageHospitalsPage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch hospitals
  const { data: hospitals, isLoading } = useQuery({
    queryKey: ['admin-hospitals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .order('name_ar');
      if (error) throw error;
      return data;
    },
  });

  const filteredHospitals = hospitals?.filter(h =>
    h.name_ar?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.name_en?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {language === 'ar' ? 'إدارة المستشفيات' : 'Manage Hospitals'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? `${hospitals?.length || 0} مستشفى مسجل`
                : `${hospitals?.length || 0} registered hospitals`
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
              {language === 'ar' ? 'إضافة مستشفى' : 'Add Hospital'}
            </Button>
          </div>
        </div>

        {/* Hospitals List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hospital className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'قائمة المستشفيات' : 'Hospitals List'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
              </div>
            ) : filteredHospitals && filteredHospitals.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredHospitals.map(hospital => (
                  <div
                    key={hospital.id}
                    className="p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Hospital className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">
                            {language === 'ar' ? hospital.name_ar : hospital.name_en}
                          </h3>
                          <Badge variant={hospital.is_active ? 'default' : 'secondary'}>
                            {hospital.is_active 
                              ? (language === 'ar' ? 'نشط' : 'Active')
                              : (language === 'ar' ? 'غير نشط' : 'Inactive')
                            }
                          </Badge>
                        </div>
                        {hospital.address && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {hospital.address}
                          </p>
                        )}
                        {hospital.phone && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <Phone className="h-3 w-3" />
                            {hospital.phone}
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
                <Hospital className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>{language === 'ar' ? 'لا توجد مستشفيات' : 'No hospitals found'}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
