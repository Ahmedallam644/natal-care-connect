import { useState } from 'react';
import { DoctorLayout } from '@/components/layouts/DoctorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  TestTube,
  Search,
  Clock,
  CheckCircle2,
  User,
  Plus,
  FileText,
} from 'lucide-react';

export default function LabOrdersPage() {
  const { language, isRTL } = useLanguage();
  const { user } = useAuth();
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

  // Fetch lab orders
  const { data: labOrders, isLoading } = useQuery({
    queryKey: ['doctor-lab-orders', doctor?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lab_orders')
        .select(`
          *,
          patients!inner (
            id,
            profiles:user_id (full_name)
          ),
          lab_results (*)
        `)
        .eq('doctor_id', doctor?.id)
        .order('ordered_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!doctor?.id,
  });

  const pendingOrders = labOrders?.filter(o => o.status === 'pending') || [];
  const completedOrders = labOrders?.filter(o => o.status === 'completed') || [];

  const filteredPending = pendingOrders.filter(o =>
    o.patients?.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.test_name_en?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCompleted = completedOrders.filter(o =>
    o.patients?.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.test_name_en?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DoctorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {language === 'ar' ? 'طلبات التحاليل' : 'Lab Orders'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'ar' ? 'إدارة ومتابعة طلبات التحاليل' : 'Manage and track lab orders'}
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
              {language === 'ar' ? 'طلب جديد' : 'New Order'}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-yellow-500/10 border-yellow-500/20">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold text-yellow-600">{pendingOrders.length}</p>
              <p className="text-sm text-muted-foreground">
                {language === 'ar' ? 'قيد الانتظار' : 'Pending'}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-green-500/10 border-green-500/20">
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold text-green-600">{completedOrders.length}</p>
              <p className="text-sm text-muted-foreground">
                {language === 'ar' ? 'مكتمل' : 'Completed'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="pending">
              {language === 'ar' ? `قيد الانتظار (${pendingOrders.length})` : `Pending (${pendingOrders.length})`}
            </TabsTrigger>
            <TabsTrigger value="completed">
              {language === 'ar' ? `مكتمل (${completedOrders.length})` : `Completed (${completedOrders.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            <Card>
              <CardContent className="p-4">
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                  </div>
                ) : filteredPending.length > 0 ? (
                  <div className="space-y-3">
                    {filteredPending.map(order => (
                      <div
                        key={order.id}
                        className="p-4 rounded-xl border border-border bg-card"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                            <TestTube className="h-6 w-6 text-yellow-500" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">
                              {language === 'ar' ? order.test_name_ar : order.test_name_en}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <User className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {order.patients?.profiles?.full_name}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {format(new Date(order.ordered_at), 'PPp', { locale: isRTL ? ar : undefined })}
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
                            {language === 'ar' ? 'قيد الانتظار' : 'Pending'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <TestTube className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>{language === 'ar' ? 'لا توجد طلبات قيد الانتظار' : 'No pending orders'}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="mt-4">
            <Card>
              <CardContent className="p-4">
                {filteredCompleted.length > 0 ? (
                  <div className="space-y-3">
                    {filteredCompleted.map(order => (
                      <div
                        key={order.id}
                        className="p-4 rounded-xl border border-border bg-card"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <FileText className="h-6 w-6 text-green-500" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">
                              {language === 'ar' ? order.test_name_ar : order.test_name_en}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <User className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {order.patients?.profiles?.full_name}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {format(new Date(order.ordered_at), 'PPp', { locale: isRTL ? ar : undefined })}
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                            {language === 'ar' ? 'مكتمل' : 'Completed'}
                          </Badge>
                        </div>
                        {order.lab_results?.length > 0 && (
                          <Button variant="outline" size="sm" className="mt-3 w-full">
                            {language === 'ar' ? 'عرض النتائج' : 'View Results'}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>{language === 'ar' ? 'لا توجد طلبات مكتملة' : 'No completed orders'}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DoctorLayout>
  );
}
