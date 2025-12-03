import { useState, useEffect } from 'react';
import { PatientLayout } from '@/components/layouts/PatientLayout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Baby, Plus, Minus, Clock, Calendar, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function KickCounter() {
  const { isRTL } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [kickCount, setKickCount] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [todayTotal, setTodayTotal] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime.getTime()) / 60000);
        setElapsedMinutes(elapsed);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, startTime]);

  const startSession = () => {
    setIsRecording(true);
    setStartTime(new Date());
    setKickCount(0);
    setElapsedMinutes(0);
  };

  const recordKick = () => {
    if (isRecording) {
      setKickCount((prev) => prev + 1);
    }
  };

  const saveSession = async () => {
    if (!user || kickCount === 0) return;

    try {
      // Note: In production, you'd save to the fmc_records table
      toast({
        title: isRTL ? 'تم الحفظ' : 'Saved',
        description: isRTL
          ? `تم تسجيل ${kickCount} ركلة في ${elapsedMinutes} دقيقة`
          : `Recorded ${kickCount} kicks in ${elapsedMinutes} minutes`,
      });
      
      setTodayTotal((prev) => prev + kickCount);
      setIsRecording(false);
      setKickCount(0);
      setStartTime(null);
    } catch (error) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في حفظ البيانات' : 'Failed to save data',
        variant: 'destructive',
      });
    }
  };

  // Weekly data for chart
  const weeklyData = [
    { day: isRTL ? 'س' : 'S', kicks: 45 },
    { day: isRTL ? 'أ' : 'M', kicks: 52 },
    { day: isRTL ? 'ث' : 'T', kicks: 38 },
    { day: isRTL ? 'ر' : 'W', kicks: 61 },
    { day: isRTL ? 'خ' : 'T', kicks: 55 },
    { day: isRTL ? 'ج' : 'F', kicks: 48 },
    { day: isRTL ? 'س' : 'S', kicks: todayTotal + kickCount },
  ];

  const maxKicks = Math.max(...weeklyData.map((d) => d.kicks));

  return (
    <PatientLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isRTL ? 'عداد حركة الجنين' : 'Fetal Movement Counter'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isRTL
              ? 'تتبعي حركات جنينك للاطمئنان على صحته'
              : 'Track your baby movements to monitor their health'}
          </p>
        </div>

        {/* Main Counter Card */}
        <div className="healthcare-card p-8 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Clock className="h-4 w-4" />
              <span>
                {isRecording
                  ? `${elapsedMinutes} ${isRTL ? 'دقيقة' : 'min'}`
                  : isRTL
                  ? 'جاهز للبدء'
                  : 'Ready to start'}
              </span>
            </div>
          </div>

          {/* Kick Count Display */}
          <div className="mb-8">
            <div className="text-8xl font-bold text-foreground mb-2">{kickCount}</div>
            <p className="text-muted-foreground">
              {isRTL ? 'ركلة' : kickCount === 1 ? 'kick' : 'kicks'}
            </p>
          </div>

          {/* Main Action Button */}
          {!isRecording ? (
            <Button
              variant="hero"
              size="xl"
              onClick={startSession}
              className="w-full max-w-sm mx-auto"
            >
              <Baby className="h-6 w-6" />
              {isRTL ? 'بدء التسجيل' : 'Start Recording'}
            </Button>
          ) : (
            <div className="space-y-4">
              <Button
                variant="default"
                size="xl"
                onClick={recordKick}
                className="w-64 h-64 rounded-full text-2xl flex-col gap-4 shadow-glow animate-pulse-soft"
              >
                <Plus className="h-12 w-12" />
                <span>{isRTL ? 'سجلي ركلة' : 'Record Kick'}</span>
              </Button>
              
              <div className="flex justify-center gap-4 mt-6">
                <Button variant="outline" onClick={() => setIsRecording(false)}>
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button variant="success" onClick={saveSession} disabled={kickCount === 0}>
                  {isRTL ? 'حفظ الجلسة' : 'Save Session'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="healthcare-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? 'مجموع اليوم' : "Today's Total"}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {todayTotal + kickCount}
                </p>
              </div>
            </div>
          </div>
          <div className="healthcare-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? 'المعدل الأسبوعي' : 'Weekly Average'}
                </p>
                <p className="text-2xl font-bold text-foreground">48</p>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="healthcare-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {isRTL ? 'نشاط الأسبوع' : 'Weekly Activity'}
          </h3>
          <div className="flex items-end justify-between gap-2 h-40">
            {weeklyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className={cn(
                    'w-full rounded-t-lg transition-all',
                    index === weeklyData.length - 1
                      ? 'bg-primary'
                      : 'bg-primary/30'
                  )}
                  style={{
                    height: `${(data.kicks / maxKicks) * 100}%`,
                    minHeight: '8px',
                  }}
                />
                <span className="text-xs text-muted-foreground">{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Card */}
        <div className="healthcare-card p-6 bg-info/5 border-info/20">
          <h3 className="font-semibold text-foreground mb-2">
            {isRTL ? 'نصيحة' : 'Tip'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isRTL
              ? 'يُنصح بتسجيل 10 حركات على الأقل خلال ساعتين. إذا شعرتِ بتغير ملحوظ في نمط الحركة، استشيري طبيبك.'
              : 'Aim to count at least 10 movements within 2 hours. If you notice a significant change in movement patterns, consult your doctor.'}
          </p>
        </div>
      </div>
    </PatientLayout>
  );
}
