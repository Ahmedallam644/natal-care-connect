import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { StatCard } from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Users,
  Hospital,
  TestTube,
  Activity,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';

export default function AdminDashboard() {
  const { language, isRTL } = useLanguage();
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  const recentDoctors = [
    {
      name: 'د. أحمد محمد',
      nameEn: 'Dr. Ahmed Mohammed',
      specialty: isRTL ? 'طب النساء والتوليد' : 'OB-GYN',
      patients: 24,
      status: 'active',
    },
    {
      name: 'د. سمية علي',
      nameEn: 'Dr. Somaya Ali',
      specialty: isRTL ? 'طب النساء والتوليد' : 'OB-GYN',
      patients: 18,
      status: 'active',
    },
    {
      name: 'د. خالد حسن',
      nameEn: 'Dr. Khaled Hassan',
      specialty: isRTL ? 'طب النساء والتوليد' : 'OB-GYN',
      patients: 31,
      status: 'active',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={language === 'ar' ? 'إجمالي الأطباء' : 'Total Doctors'}
            value={12}
            icon={Users}
            trend="up"
            trendValue="+2"
          />
          <StatCard
            title={language === 'ar' ? 'المستشفيات' : 'Hospitals'}
            value={8}
            icon={Hospital}
          />
          <StatCard
            title={language === 'ar' ? 'فئات التحاليل' : 'Lab Categories'}
            value={24}
            icon={TestTube}
          />
          <StatCard
            title={language === 'ar' ? 'المريضات النشطات' : 'Active Patients'}
            value={156}
            icon={Activity}
            trend="up"
            trendValue="+12"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/admin/doctors">
            <Button variant="card" className="w-full h-auto py-6 flex-col gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium">
                {language === 'ar' ? 'إضافة طبيب' : 'Add Doctor'}
              </span>
            </Button>
          </Link>
          <Link to="/admin/hospitals">
            <Button variant="card" className="w-full h-auto py-6 flex-col gap-3">
              <div className="p-3 rounded-xl bg-info/10">
                <Hospital className="h-6 w-6 text-info" />
              </div>
              <span className="text-sm font-medium">
                {language === 'ar' ? 'إضافة مستشفى' : 'Add Hospital'}
              </span>
            </Button>
          </Link>
          <Link to="/admin/lab-categories">
            <Button variant="card" className="w-full h-auto py-6 flex-col gap-3">
              <div className="p-3 rounded-xl bg-success/10">
                <TestTube className="h-6 w-6 text-success" />
              </div>
              <span className="text-sm font-medium">
                {language === 'ar' ? 'فئات التحاليل' : 'Lab Categories'}
              </span>
            </Button>
          </Link>
          <Link to="/admin/reports">
            <Button variant="card" className="w-full h-auto py-6 flex-col gap-3">
              <div className="p-3 rounded-xl bg-accent/10">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <span className="text-sm font-medium">
                {language === 'ar' ? 'التقارير' : 'Reports'}
              </span>
            </Button>
          </Link>
        </div>

        {/* Doctors List */}
        <div className="healthcare-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              {language === 'ar' ? 'الأطباء' : 'Doctors'}
            </h3>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/doctors">
                {language === 'ar' ? 'عرض الكل' : 'View All'}
                <ChevronIcon className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-start py-3 px-4 text-sm font-medium text-muted-foreground">
                    {language === 'ar' ? 'الاسم' : 'Name'}
                  </th>
                  <th className="text-start py-3 px-4 text-sm font-medium text-muted-foreground">
                    {language === 'ar' ? 'التخصص' : 'Specialty'}
                  </th>
                  <th className="text-start py-3 px-4 text-sm font-medium text-muted-foreground">
                    {language === 'ar' ? 'المريضات' : 'Patients'}
                  </th>
                  <th className="text-start py-3 px-4 text-sm font-medium text-muted-foreground">
                    {language === 'ar' ? 'الحالة' : 'Status'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentDoctors.map((doctor, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary text-sm font-medium">
                            {(isRTL ? doctor.name : doctor.nameEn)[0]}
                          </span>
                        </div>
                        <span className="font-medium text-foreground">
                          {isRTL ? doctor.name : doctor.nameEn}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{doctor.specialty}</td>
                    <td className="py-3 px-4 text-muted-foreground">{doctor.patients}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                        {language === 'ar' ? 'نشط' : 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Status */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="healthcare-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {language === 'ar' ? 'إحصائيات النظام' : 'System Statistics'}
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: language === 'ar' ? 'إجمالي التسجيلات اليوم' : "Today's Registrations",
                  value: 12,
                },
                {
                  label: language === 'ar' ? 'التحاليل المرفوعة' : 'Labs Uploaded',
                  value: 45,
                },
                {
                  label: language === 'ar' ? 'الرسائل المرسلة' : 'Messages Sent',
                  value: 234,
                },
                {
                  label: language === 'ar' ? 'تنبيهات المخاطر' : 'Risk Alerts',
                  value: 8,
                },
              ].map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <span className="text-muted-foreground">{stat.label}</span>
                  <span className="font-semibold text-foreground">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="healthcare-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {language === 'ar' ? 'حالة الذكاء الاصطناعي' : 'AI Status'}
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="font-medium text-success">
                    {language === 'ar' ? 'يعمل بشكل طبيعي' : 'Operating Normally'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar'
                    ? 'جميع نماذج التنبؤ بالمخاطر تعمل بشكل صحيح'
                    : 'All risk prediction models are functioning correctly'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-secondary/50 text-center">
                  <p className="text-2xl font-bold text-foreground">98.5%</p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'دقة التنبؤ' : 'Prediction Accuracy'}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50 text-center">
                  <p className="text-2xl font-bold text-foreground">1,234</p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'التحليلات اليوم' : 'Analyses Today'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
