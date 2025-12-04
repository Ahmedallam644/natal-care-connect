import { DoctorLayout } from '@/components/layouts/DoctorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  Users,
  AlertTriangle,
  TestTube,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data for charts
const monthlyPatients = [
  { month: 'يناير', count: 12 },
  { month: 'فبراير', count: 19 },
  { month: 'مارس', count: 15 },
  { month: 'أبريل', count: 22 },
  { month: 'مايو', count: 28 },
  { month: 'يونيو', count: 32 },
];

const riskDistribution = [
  { name: 'منخفض', value: 45, color: '#22c55e' },
  { name: 'متوسط', value: 30, color: '#f59e0b' },
  { name: 'عالي', value: 20, color: '#ef4444' },
  { name: 'حرج', value: 5, color: '#dc2626' },
];

const labOrdersData = [
  { week: 'الأسبوع 1', orders: 15, completed: 12 },
  { week: 'الأسبوع 2', orders: 20, completed: 18 },
  { week: 'الأسبوع 3', orders: 18, completed: 15 },
  { week: 'الأسبوع 4', orders: 25, completed: 22 },
];

export default function AnalyticsPage() {
  const { language, isRTL } = useLanguage();
  const { user } = useAuth();

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

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ['doctor-stats', doctor?.id],
    queryFn: async () => {
      const [patientsRes, alertsRes, labsRes] = await Promise.all([
        supabase.from('patients').select('id', { count: 'exact' }).eq('linked_doctor_id', doctor?.id),
        supabase.from('ai_risk_scores').select('id', { count: 'exact' }).in('overall_risk_level', ['high', 'critical']),
        supabase.from('lab_orders').select('id', { count: 'exact' }).eq('doctor_id', doctor?.id),
      ]);
      
      return {
        patients: patientsRes.count || 0,
        alerts: alertsRes.count || 0,
        labs: labsRes.count || 0,
      };
    },
    enabled: !!doctor?.id,
  });

  return (
    <DoctorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {language === 'ar' ? 'التحليلات والإحصائيات' : 'Analytics & Statistics'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'ar' ? 'نظرة شاملة على أداء العيادة' : 'Overview of clinic performance'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{stats?.patients || 0}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'إجمالي المريضات' : 'Total Patients'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{stats?.alerts || 0}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'حالات مخاطر' : 'Risk Cases'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                  <TestTube className="h-6 w-6 text-info" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{stats?.labs || 0}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'طلبات تحاليل' : 'Lab Orders'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">85%</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'معدل الإنجاز' : 'Completion Rate'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient Growth */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                {language === 'ar' ? 'نمو المريضات' : 'Patient Growth'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyPatients}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Risk Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                {language === 'ar' ? 'توزيع المخاطر' : 'Risk Distribution'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Lab Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'طلبات التحاليل الأسبوعية' : 'Weekly Lab Orders'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={labOrdersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="hsl(var(--primary))" name={language === 'ar' ? 'الطلبات' : 'Orders'} />
                <Bar dataKey="completed" fill="hsl(var(--accent))" name={language === 'ar' ? 'المكتملة' : 'Completed'} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DoctorLayout>
  );
}
