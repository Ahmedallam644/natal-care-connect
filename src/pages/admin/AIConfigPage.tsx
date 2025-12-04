import { useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import {
  Cpu,
  Save,
  AlertTriangle,
  Activity,
  Baby,
  Droplets,
  Heart,
} from 'lucide-react';

const riskFactors = [
  { 
    id: 'preeclampsia',
    icon: Heart,
    labelAr: 'تسمم الحمل',
    labelEn: 'Preeclampsia',
    descAr: 'عتبة التنبيه لخطر تسمم الحمل',
    descEn: 'Alert threshold for preeclampsia risk',
  },
  { 
    id: 'gestational_diabetes',
    icon: Droplets,
    labelAr: 'سكري الحمل',
    labelEn: 'Gestational Diabetes',
    descAr: 'عتبة التنبيه لخطر سكري الحمل',
    descEn: 'Alert threshold for gestational diabetes risk',
  },
  { 
    id: 'anemia',
    icon: Activity,
    labelAr: 'فقر الدم',
    labelEn: 'Anemia',
    descAr: 'عتبة التنبيه لخطر فقر الدم',
    descEn: 'Alert threshold for anemia risk',
  },
  { 
    id: 'preterm_birth',
    icon: Baby,
    labelAr: 'الولادة المبكرة',
    labelEn: 'Preterm Birth',
    descAr: 'عتبة التنبيه لخطر الولادة المبكرة',
    descEn: 'Alert threshold for preterm birth risk',
  },
  { 
    id: 'fetal_growth',
    icon: AlertTriangle,
    labelAr: 'تقييد نمو الجنين',
    labelEn: 'Fetal Growth Restriction',
    descAr: 'عتبة التنبيه لخطر تقييد نمو الجنين',
    descEn: 'Alert threshold for fetal growth restriction risk',
  },
];

export default function AIConfigPage() {
  const { language } = useLanguage();
  const [thresholds, setThresholds] = useState<Record<string, number>>({
    preeclampsia: 70,
    gestational_diabetes: 65,
    anemia: 60,
    preterm_birth: 75,
    fetal_growth: 70,
  });
  const [autoAlert, setAutoAlert] = useState(true);
  const [dailyScan, setDailyScan] = useState(true);

  const handleSave = () => {
    toast.success(language === 'ar' ? 'تم حفظ الإعدادات' : 'Settings saved');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {language === 'ar' ? 'إعدادات الذكاء الاصطناعي' : 'AI Configuration'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? 'ضبط معايير تقييم المخاطر والتنبيهات'
                : 'Configure risk assessment parameters and alerts'
              }
            </p>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            {language === 'ar' ? 'حفظ الإعدادات' : 'Save Settings'}
          </Button>
        </div>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'الإعدادات العامة' : 'General Settings'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {language === 'ar' ? 'التنبيهات التلقائية' : 'Auto Alerts'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' 
                    ? 'إرسال تنبيهات تلقائية للأطباء عند تجاوز العتبات'
                    : 'Send automatic alerts to doctors when thresholds are exceeded'
                  }
                </p>
              </div>
              <Switch checked={autoAlert} onCheckedChange={setAutoAlert} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {language === 'ar' ? 'الفحص اليومي' : 'Daily Scan'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' 
                    ? 'إجراء فحص يومي لجميع المريضات'
                    : 'Perform daily risk assessment for all patients'
                  }
                </p>
              </div>
              <Switch checked={dailyScan} onCheckedChange={setDailyScan} />
            </div>
          </CardContent>
        </Card>

        {/* Risk Thresholds */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'عتبات المخاطر' : 'Risk Thresholds'}
            </CardTitle>
            <CardDescription>
              {language === 'ar' 
                ? 'حدد النسبة المئوية التي سيتم عندها تصنيف الحالة كخطرة'
                : 'Set the percentage at which a case will be classified as high risk'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {riskFactors.map(factor => (
              <div key={factor.id} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <factor.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        {language === 'ar' ? factor.labelAr : factor.labelEn}
                      </p>
                      <span className="text-lg font-bold text-primary">
                        {thresholds[factor.id]}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? factor.descAr : factor.descEn}
                    </p>
                  </div>
                </div>
                <Slider
                  value={[thresholds[factor.id]]}
                  onValueChange={([value]) => 
                    setThresholds(prev => ({ ...prev, [factor.id]: value }))
                  }
                  max={100}
                  min={10}
                  step={5}
                  className="w-full"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-info/10 border-info/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Cpu className="h-6 w-6 text-info flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium text-info">
                  {language === 'ar' ? 'ملاحظة مهمة' : 'Important Note'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === 'ar' 
                    ? 'يستخدم النظام خوارزميات بسيطة قائمة على القواعد لتقييم المخاطر. هذه التقييمات إرشادية فقط ولا تغني عن التشخيص الطبي المتخصص.'
                    : 'The system uses simple rule-based algorithms for risk assessment. These assessments are advisory only and do not replace specialized medical diagnosis.'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
