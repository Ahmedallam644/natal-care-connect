import { useState } from 'react';
import { PatientLayout } from '@/components/layouts/PatientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  TestTube,
  Upload,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig = {
  pending: { labelAr: 'قيد الانتظار', labelEn: 'Pending', color: 'bg-yellow-500', icon: Clock },
  completed: { labelAr: 'مكتمل', labelEn: 'Completed', color: 'bg-green-500', icon: CheckCircle2 },
  overdue: { labelAr: 'متأخر', labelEn: 'Overdue', color: 'bg-red-500', icon: AlertCircle },
};

export default function LabTestsPage() {
  const { isRTL } = useLanguage();
  const { user } = useAuth();

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

  // Fetch lab orders
  const { data: labOrders, isLoading } = useQuery({
    queryKey: ['lab-orders', patient?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lab_orders')
        .select(`
          *,
          lab_results (*)
        `)
        .eq('patient_id', patient?.id)
        .order('ordered_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!patient?.id,
  });

  const pendingTests = labOrders?.filter(o => o.status === 'pending') || [];
  const completedTests = labOrders?.filter(o => o.status === 'completed') || [];

  return (
    <PatientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isRTL ? 'التحاليل المطلوبة' : 'Lab Tests'}
          </h1>
          <p className="text-muted-foreground">
            {isRTL ? 'التحاليل المطلوبة من طبيبك ونتائجها' : 'Tests ordered by your doctor and their results'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-yellow-500/10 border-yellow-500/20">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold text-yellow-600">{pendingTests.length}</p>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'قيد الانتظار' : 'Pending'}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-green-500/10 border-green-500/20">
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold text-green-600">{completedTests.length}</p>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'مكتمل' : 'Completed'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Tests */}
        {pendingTests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                {isRTL ? 'تحاليل تحتاج للإجراء' : 'Tests Requiring Action'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingTests.map(test => (
                <div
                  key={test.id}
                  className="p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <TestTube className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {isRTL ? test.test_name_ar : test.test_name_en}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(test.ordered_at), 'PP', { locale: isRTL ? ar : undefined })}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
                      {isRTL ? 'قيد الانتظار' : 'Pending'}
                    </Badge>
                  </div>
                  
                  {test.instructions && (
                    <p className="text-sm text-muted-foreground mb-3 p-3 bg-secondary/30 rounded-lg">
                      {test.instructions}
                    </p>
                  )}
                  
                  {test.due_date && (
                    <p className="text-sm text-muted-foreground mb-3">
                      <span className="font-medium">{isRTL ? 'تاريخ الاستحقاق:' : 'Due date:'}</span>{' '}
                      {format(new Date(test.due_date), 'PP', { locale: isRTL ? ar : undefined })}
                    </p>
                  )}
                  
                  <Button className="w-full gap-2">
                    <Upload className="h-4 w-4" />
                    {isRTL ? 'رفع النتيجة' : 'Upload Result'}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Completed Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              {isRTL ? 'التحاليل المكتملة' : 'Completed Tests'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                {isRTL ? 'جاري التحميل...' : 'Loading...'}
              </div>
            ) : completedTests.length > 0 ? (
              <div className="space-y-3">
                {completedTests.map(test => (
                  <div
                    key={test.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {isRTL ? test.test_name_ar : test.test_name_en}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(test.ordered_at), 'PP', { locale: isRTL ? ar : undefined })}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                      {isRTL ? 'مكتمل' : 'Completed'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {isRTL ? 'لا توجد تحاليل مكتملة' : 'No completed tests'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PatientLayout>
  );
}
