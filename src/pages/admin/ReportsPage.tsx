import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import {
  FileText,
  Users,
  Stethoscope,
  Hospital,
  TestTube,
  Download,
  TrendingUp,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock data
const monthlyRegistrations = [
  { month: 'Jan', patients: 45, doctors: 3 },
  { month: 'Feb', patients: 52, doctors: 2 },
  { month: 'Mar', patients: 61, doctors: 4 },
  { month: 'Apr', patients: 78, doctors: 3 },
  { month: 'May', patients: 89, doctors: 5 },
  { month: 'Jun', patients: 105, doctors: 4 },
];

export default function ReportsPage() {
  const { language } = useLanguage();

  // Fetch system stats
  const { data: stats } = useQuery({
    queryKey: ['admin-reports-stats'],
    queryFn: async () => {
      const [patientsRes, doctorsRes, hospitalsRes, labsRes] = await Promise.all([
        supabase.from('patients').select('id', { count: 'exact' }),
        supabase.from('doctors').select('id', { count: 'exact' }),
        supabase.from('hospitals').select('id', { count: 'exact' }),
        supabase.from('lab_orders').select('id', { count: 'exact' }),
      ]);
      
      return {
        patients: patientsRes.count || 0,
        doctors: doctorsRes.count || 0,
        hospitals: hospitalsRes.count || 0,
        labs: labsRes.count || 0,
      };
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {language === 'ar' ? 'التقارير' : 'Reports'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'ar' ? 'نظرة شاملة على النظام' : 'System overview and analytics'}
            </p>
          </div>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            {language === 'ar' ? 'تصدير التقرير' : 'Export Report'}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{stats?.patients || 0}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'المريضات' : 'Patients'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-info" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{stats?.doctors || 0}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'الأطباء' : 'Doctors'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Hospital className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{stats?.hospitals || 0}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'المستشفيات' : 'Hospitals'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <TestTube className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{stats?.labs || 0}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'التحاليل' : 'Lab Orders'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                {language === 'ar' ? 'التسجيلات الشهرية' : 'Monthly Registrations'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyRegistrations}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="patients" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name={language === 'ar' ? 'المريضات' : 'Patients'}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="doctors" 
                    stroke="hsl(var(--info))" 
                    strokeWidth={2}
                    name={language === 'ar' ? 'الأطباء' : 'Doctors'}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {language === 'ar' ? 'التحاليل الشهرية' : 'Monthly Lab Orders'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyRegistrations}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="patients" 
                    fill="hsl(var(--primary))" 
                    name={language === 'ar' ? 'الطلبات' : 'Orders'}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
