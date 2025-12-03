import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PatientLayout } from '@/components/layouts/PatientLayout';
import { StatCard } from '@/components/StatCard';
import { RiskBadge } from '@/components/RiskBadge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Baby,
  ClipboardList,
  TestTube,
  MessageCircle,
  Plus,
  Calendar,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

export default function PatientDashboard() {
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();
  const [kicksToday, setKicksToday] = useState(0);
  const [symptomsCount, setSymptoms] = useState(0);
  const [pendingTests, setPendingTests] = useState(0);
  const [riskLevel, setRiskLevel] = useState<'low' | 'moderate' | 'high' | 'critical'>('low');

  useEffect(() => {
    // TODO: Fetch real data from database
  }, [user]);

  const quickActions = [
    {
      icon: Baby,
      label: isRTL ? 'تسجيل ركلة' : 'Record Kick',
      path: '/patient/fmc',
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: ClipboardList,
      label: isRTL ? 'إضافة عرض' : 'Add Symptom',
      path: '/patient/symptoms',
      color: 'bg-accent/10 text-accent',
    },
    {
      icon: TestTube,
      label: isRTL ? 'رفع نتيجة' : 'Upload Result',
      path: '/patient/lab-tests',
      color: 'bg-success/10 text-success',
    },
    {
      icon: MessageCircle,
      label: isRTL ? 'محادثة الطبيب' : 'Chat Doctor',
      path: '/patient/chat',
      color: 'bg-info/10 text-info',
    },
  ];

  return (
    <PatientLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Pregnancy Status Card */}
        <div className="healthcare-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {isRTL ? 'حالة الحمل' : 'Pregnancy Status'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'الأسبوع 28' : 'Week 28'}
              </p>
            </div>
            <RiskBadge level={riskLevel} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-xs">{isRTL ? 'تاريخ الولادة' : 'Due Date'}</span>
              </div>
              <p className="font-semibold">15 مارس 2025</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs">{isRTL ? 'المتابعة القادمة' : 'Next Checkup'}</span>
              </div>
              <p className="font-semibold">25 ديسمبر</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t('kicks_today')}
            value={kicksToday}
            icon={Baby}
            trend="up"
            trendValue="+5"
          />
          <StatCard
            title={t('symptoms')}
            value={symptomsCount}
            subtitle={isRTL ? 'هذا الأسبوع' : 'This week'}
            icon={ClipboardList}
          />
          <StatCard
            title={isRTL ? 'تحاليل معلقة' : 'Pending Tests'}
            value={pendingTests}
            icon={TestTube}
          />
          <StatCard
            title={isRTL ? 'رسائل جديدة' : 'New Messages'}
            value={2}
            icon={MessageCircle}
          />
        </div>

        {/* Quick Actions */}
        <div className="healthcare-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {isRTL ? 'إجراءات سريعة' : 'Quick Actions'}
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.path} to={action.path}>
                <Button
                  variant="card"
                  className="w-full h-auto flex-col gap-3 py-6"
                >
                  <div className={`p-3 rounded-xl ${action.color}`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Alerts Section */}
        <div className="healthcare-card p-6 border-warning/30">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-warning/10">
              <AlertCircle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">
                {isRTL ? 'تذكير مهم' : 'Important Reminder'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {isRTL
                  ? 'لديك تحليل دم معلق، يرجى رفع النتائج قبل موعد المتابعة القادم'
                  : 'You have a pending blood test. Please upload results before your next checkup.'}
              </p>
              <Button variant="link" className="p-0 h-auto mt-2" asChild>
                <Link to="/patient/lab-tests">
                  {isRTL ? 'عرض التفاصيل' : 'View Details'} →
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="healthcare-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {isRTL ? 'النشاط الأخير' : 'Recent Activity'}
          </h3>
          <div className="space-y-4">
            {[
              {
                icon: Baby,
                title: isRTL ? 'تم تسجيل 10 ركلات' : '10 kicks recorded',
                time: isRTL ? 'منذ ساعتين' : '2 hours ago',
                color: 'text-primary',
              },
              {
                icon: ClipboardList,
                title: isRTL ? 'أضفت عرض: صداع خفيف' : 'Added symptom: Mild headache',
                time: isRTL ? 'أمس' : 'Yesterday',
                color: 'text-accent',
              },
              {
                icon: MessageCircle,
                title: isRTL ? 'رسالة من د. أحمد' : 'Message from Dr. Ahmed',
                time: isRTL ? 'منذ يومين' : '2 days ago',
                color: 'text-info',
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                <div className={`p-2 rounded-lg bg-secondary ${activity.color}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
