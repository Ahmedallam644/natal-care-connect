import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  const { t } = useLanguage();

  const labels: Record<RiskLevel, string> = {
    low: t('low_risk'),
    moderate: t('moderate_risk'),
    high: t('high_risk'),
    critical: t('critical_risk'),
  };

  const styles: Record<RiskLevel, string> = {
    low: 'risk-low',
    moderate: 'risk-moderate',
    high: 'risk-high',
    critical: 'risk-critical',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        styles[level],
        className
      )}
    >
      {labels[level]}
    </span>
  );
}
