import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DoctorLayout } from '@/components/layouts/DoctorLayout';
import { StatCard } from '@/components/StatCard';
import { RiskBadge } from '@/components/RiskBadge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  AlertTriangle,
  TestTube,
  MessageCircle,
  TrendingUp,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DoctorDashboard() {
  const { language, isRTL } = useLanguage();
  const { profile } = useAuth();

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  // Mock data for patients with alerts
  const alertPatients = [
    {
      id: '1',
      name: 'سارة أحمد',
      nameEn: 'Sarah Ahmed',
      week: 32,
      risk: 'high' as const,
      alert: isRTL ? 'انخفاض حركة الجنين' : 'Reduced fetal movement',
      time: isRTL ? 'منذ ساعة' : '1 hour ago',
    },
    {
      id: '2',
      name: 'فاطمة محمد',
      nameEn: 'Fatima Mohammed',
      week: 28,
      risk: 'moderate' as const,
      alert: isRTL ? 'ارتفاع ضغط الدم' : 'Elevated blood pressure',
      time: isRTL ? 'منذ 3 ساعات' : '3 hours ago',
    },
    {
      id: '3',
      name: 'نورا علي',
      nameEn: 'Nora Ali',
      week: 36,
      risk: 'critical' as const,
      alert: isRTL ? 'نتائج تحليل غير طبيعية' : 'Abnormal lab results',
      time: isRTL ? 'منذ 30 دقيقة' : '30 min ago',
    },
  ];

  const recentMessages = [
    {
      patient: isRTL ? 'سارة أحمد' : 'Sarah Ahmed',
      message: isRTL ? 'شكراً دكتور على المتابعة' : 'Thank you doctor for the follow-up',
      time: isRTL ? 'منذ 10 دقائق' : '10 min ago',
      unread: true,
    },
    {
      patient: isRTL ? 'هدى سالم' : 'Huda Salem',
      message: isRTL ? 'هل أحتاج لزيارة الطوارئ؟' : 'Do I need to visit emergency?',
      time: isRTL ? 'منذ ساعة' : '1 hour ago',
      unread: true,
    },
  ];

  return (
    <DoctorLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={language === 'ar' ? 'إجمالي المريضات' : 'Total Patients'}
            value={24}
            icon={Users}
            trend="up"
            trendValue="+3"
          />
          <StatCard
            title={language === 'ar' ? 'تنبيهات نشطة' : 'Active Alerts'}
            value={5}
            icon={AlertTriangle}
            className="border-warning/30"
          />
          <StatCard
            title={language === 'ar' ? 'تحاليل معلقة' : 'Pending Labs'}
            value={8}
            icon={TestTube}
          />
          <StatCard
            title={language === 'ar' ? 'رسائل جديدة' : 'New Messages'}
            value={12}
            icon={MessageCircle}
          />
        </div>

        {/* Critical Alerts */}
        <div className="healthcare-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              {language === 'ar' ? 'تنبيهات المريضات' : 'Patient Alerts'}
            </h3>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/doctor/alerts">
                {language === 'ar' ? 'عرض الكل' : 'View All'}
                <ChevronIcon className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="space-y-3">
            {alertPatients.map((patient) => (
              <Link
                key={patient.id}
                to={`/doctor/patients/${patient.id}`}
                className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-accent font-medium">
                    {(isRTL ? patient.name : patient.nameEn)[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground truncate">
                      {isRTL ? patient.name : patient.nameEn}
                    </p>
                    <RiskBadge level={patient.risk} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? `الأسبوع ${patient.week}` : `Week ${patient.week}`} • {patient.alert}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {patient.time}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Messages */}
          <div className="healthcare-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {language === 'ar' ? 'الرسائل الأخيرة' : 'Recent Messages'}
              </h3>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/doctor/chat">
                  {language === 'ar' ? 'عرض الكل' : 'View All'}
                  <ChevronIcon className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="space-y-3">
              {recentMessages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    'p-4 rounded-lg transition-colors',
                    msg.unread ? 'bg-info/5 border border-info/20' : 'bg-secondary/50'
                  )}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium text-foreground">{msg.patient}</p>
                    <span className="text-xs text-muted-foreground">{msg.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{msg.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor Code */}
          <div className="healthcare-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {language === 'ar' ? 'كود الإحالة' : 'Referral Code'}
            </h3>
            <div className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {language === 'ar'
                  ? 'شاركي هذا الكود مع المريضات للربط بحسابك'
                  : 'Share this code with patients to link to your account'}
              </p>
              <p className="text-3xl font-bold tracking-widest text-primary">
                DR-2847
              </p>
              <Button variant="outline" size="sm" className="mt-4">
                {language === 'ar' ? 'نسخ الكود' : 'Copy Code'}
              </Button>
            </div>
          </div>
        </div>

        {/* Risk Distribution Chart */}
        <div className="healthcare-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {language === 'ar' ? 'توزيع مستويات الخطر' : 'Risk Level Distribution'}
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { level: 'low' as const, count: 15, label: language === 'ar' ? 'منخفض' : 'Low' },
              { level: 'moderate' as const, count: 6, label: language === 'ar' ? 'متوسط' : 'Moderate' },
              { level: 'high' as const, count: 2, label: language === 'ar' ? 'مرتفع' : 'High' },
              { level: 'critical' as const, count: 1, label: language === 'ar' ? 'حرج' : 'Critical' },
            ].map((item) => (
              <div key={item.level} className="text-center p-4 rounded-lg bg-secondary/50">
                <p className="text-3xl font-bold text-foreground">{item.count}</p>
                <RiskBadge level={item.level} className="mt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}
