import { PatientLayout } from '@/components/layouts/PatientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Hospital, MapPin, Phone, Navigation, ExternalLink } from 'lucide-react';

export default function HospitalsPage() {
  const { isRTL } = useLanguage();

  // Fetch hospitals
  const { data: hospitals, isLoading } = useQuery({
    queryKey: ['hospitals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .eq('is_active', true)
        .order('name_ar');
      if (error) throw error;
      return data;
    },
  });

  const openInMaps = (lat?: number | null, lng?: number | null, name?: string) => {
    if (lat && lng) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
    } else if (name) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`, '_blank');
    }
  };

  const callHospital = (phone?: string | null) => {
    if (phone) {
      window.open(`tel:${phone}`);
    }
  };

  return (
    <PatientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isRTL ? 'المستشفيات القريبة' : 'Nearby Hospitals'}
          </h1>
          <p className="text-muted-foreground">
            {isRTL ? 'ابحثي عن أقرب مستشفى أو مركز طوارئ' : 'Find the nearest hospital or emergency center'}
          </p>
        </div>

        {/* Emergency Banner */}
        <Card className="bg-destructive/10 border-destructive/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
                <Phone className="h-6 w-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-destructive">
                  {isRTL ? 'في حالة الطوارئ' : 'In Emergency'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? 'اتصلي برقم الطوارئ الموحد' : 'Call the unified emergency number'}
                </p>
              </div>
              <Button 
                variant="destructive" 
                size="lg"
                onClick={() => window.open('tel:997')}
              >
                997
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Hospitals List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hospital className="h-5 w-5 text-primary" />
              {isRTL ? 'قائمة المستشفيات' : 'Hospitals List'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                {isRTL ? 'جاري التحميل...' : 'Loading...'}
              </div>
            ) : hospitals && hospitals.length > 0 ? (
              <div className="space-y-4">
                {hospitals.map(hospital => (
                  <div
                    key={hospital.id}
                    className="p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Hospital className="h-7 w-7 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground">
                          {isRTL ? hospital.name_ar : hospital.name_en}
                        </h3>
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
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      {hospital.phone && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2"
                          onClick={() => callHospital(hospital.phone)}
                        >
                          <Phone className="h-4 w-4" />
                          {isRTL ? 'اتصال' : 'Call'}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={() => openInMaps(hospital.latitude, hospital.longitude, isRTL ? hospital.name_ar : hospital.name_en)}
                      >
                        <Navigation className="h-4 w-4" />
                        {isRTL ? 'الاتجاهات' : 'Directions'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Hospital className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>{isRTL ? 'لا توجد مستشفيات مسجلة' : 'No hospitals registered'}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PatientLayout>
  );
}
