import { useState } from 'react';
import { PatientLayout } from '@/components/layouts/PatientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  ThermometerSun,
  Droplets,
  Brain,
  Heart,
  Wind,
  Eye,
  Activity,
  Plus,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const symptomTypes = [
  { id: 'headache', icon: Brain, labelAr: 'صداع', labelEn: 'Headache' },
  { id: 'nausea', icon: Droplets, labelAr: 'غثيان', labelEn: 'Nausea' },
  { id: 'fever', icon: ThermometerSun, labelAr: 'حرارة', labelEn: 'Fever' },
  { id: 'fatigue', icon: Activity, labelAr: 'إرهاق', labelEn: 'Fatigue' },
  { id: 'swelling', icon: Heart, labelAr: 'تورم', labelEn: 'Swelling' },
  { id: 'breathing', icon: Wind, labelAr: 'ضيق تنفس', labelEn: 'Breathing Issues' },
  { id: 'vision', icon: Eye, labelAr: 'مشاكل بصرية', labelEn: 'Vision Problems' },
];

const severityLevels = [
  { value: 1, labelAr: 'خفيف', labelEn: 'Mild', color: 'bg-green-500' },
  { value: 2, labelAr: 'متوسط', labelEn: 'Moderate', color: 'bg-yellow-500' },
  { value: 3, labelAr: 'شديد', labelEn: 'Severe', color: 'bg-orange-500' },
  { value: 4, labelAr: 'حاد جداً', labelEn: 'Very Severe', color: 'bg-red-500' },
];

export default function SymptomsPage() {
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState(1);
  const [notes, setNotes] = useState('');

  // Fetch patient data
  const { data: patient } = useQuery({
    queryKey: ['patient', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch recent symptoms
  const { data: symptoms, isLoading } = useQuery({
    queryKey: ['symptoms', patient?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('symptoms')
        .select('*')
        .eq('patient_id', patient?.id)
        .order('recorded_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
    enabled: !!patient?.id,
  });

  // Add symptom mutation
  const addSymptom = useMutation({
    mutationFn: async () => {
      if (!patient?.id || selectedSymptoms.length === 0) return;
      
      const inserts = selectedSymptoms.map(symptomType => ({
        patient_id: patient.id,
        symptom_type: symptomType,
        severity,
        notes,
      }));

      const { error } = await supabase.from('symptoms').insert(inserts);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['symptoms'] });
      setSelectedSymptoms([]);
      setSeverity(1);
      setNotes('');
      toast.success(isRTL ? 'تم تسجيل الأعراض بنجاح' : 'Symptoms recorded successfully');
    },
    onError: () => {
      toast.error(isRTL ? 'حدث خطأ أثناء التسجيل' : 'Error recording symptoms');
    },
  });

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(s => s !== symptomId)
        : [...prev, symptomId]
    );
  };

  return (
    <PatientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isRTL ? 'تسجيل الأعراض اليومية' : 'Daily Symptoms Log'}
          </h1>
          <p className="text-muted-foreground">
            {isRTL ? 'سجلي أعراضك ليتمكن طبيبك من متابعة حالتك' : 'Record your symptoms for your doctor to monitor'}
          </p>
        </div>

        {/* Symptom Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              {isRTL ? 'اختاري الأعراض' : 'Select Symptoms'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {symptomTypes.map(symptom => (
                <button
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  className={cn(
                    'p-4 rounded-xl border-2 transition-all text-center',
                    selectedSymptoms.includes(symptom.id)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <symptom.icon className="h-8 w-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">
                    {isRTL ? symptom.labelAr : symptom.labelEn}
                  </span>
                  {selectedSymptoms.includes(symptom.id) && (
                    <Check className="h-4 w-4 mx-auto mt-1 text-primary" />
                  )}
                </button>
              ))}
            </div>

            {/* Severity */}
            {selectedSymptoms.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium mb-3">
                  {isRTL ? 'شدة الأعراض' : 'Severity Level'}
                </label>
                <div className="flex gap-2">
                  {severityLevels.map(level => (
                    <button
                      key={level.value}
                      onClick={() => setSeverity(level.value)}
                      className={cn(
                        'flex-1 py-3 rounded-lg border-2 transition-all',
                        severity === level.value
                          ? `${level.color} text-white border-transparent`
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <span className="text-sm font-medium">
                        {isRTL ? level.labelAr : level.labelEn}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedSymptoms.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  {isRTL ? 'ملاحظات إضافية' : 'Additional Notes'}
                </label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isRTL ? 'أضيفي أي تفاصيل إضافية...' : 'Add any additional details...'}
                  className="resize-none"
                  rows={3}
                />
              </div>
            )}

            {/* Submit Button */}
            {selectedSymptoms.length > 0 && (
              <Button
                onClick={() => addSymptom.mutate()}
                disabled={addSymptom.isPending}
                className="w-full mt-4"
                size="lg"
              >
                {addSymptom.isPending
                  ? (isRTL ? 'جاري التسجيل...' : 'Recording...')
                  : (isRTL ? 'تسجيل الأعراض' : 'Record Symptoms')}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Recent Symptoms */}
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? 'الأعراض السابقة' : 'Recent Symptoms'}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                {isRTL ? 'جاري التحميل...' : 'Loading...'}
              </div>
            ) : symptoms && symptoms.length > 0 ? (
              <div className="space-y-3">
                {symptoms.map(symptom => {
                  const symptomInfo = symptomTypes.find(s => s.id === symptom.symptom_type);
                  const severityInfo = severityLevels.find(s => s.value === symptom.severity);
                  
                  return (
                    <div
                      key={symptom.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30"
                    >
                      {symptomInfo && (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <symptomInfo.icon className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">
                          {symptomInfo ? (isRTL ? symptomInfo.labelAr : symptomInfo.labelEn) : symptom.symptom_type}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(symptom.recorded_at), 'PPp', { locale: isRTL ? ar : undefined })}
                        </p>
                      </div>
                      {severityInfo && (
                        <span className={cn('px-3 py-1 rounded-full text-xs text-white', severityInfo.color)}>
                          {isRTL ? severityInfo.labelAr : severityInfo.labelEn}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {isRTL ? 'لا توجد أعراض مسجلة' : 'No symptoms recorded'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PatientLayout>
  );
}
