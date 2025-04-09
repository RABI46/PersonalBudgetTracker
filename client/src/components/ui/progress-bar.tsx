import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  className?: string;
  barColor?: string;
  bgColor?: string;
  height?: string;
}

export function ProgressBar({
  progress,
  className,
  barColor = "bg-blue-600",
  bgColor = "bg-gray-200",
  height = "h-4",
}: ProgressBarProps) {
  // Ensure progress is between 0 and 100
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={cn(`w-full ${bgColor} rounded-full ${height}`, className)}>
      <div 
        className={`${barColor} ${height} rounded-full transition-all duration-500 ease-in-out`} 
        style={{ width: `${safeProgress}%` }}
      ></div>
    </div>
  );
}

interface ProgressBarWithLabelsProps extends ProgressBarProps {
  leftLabel?: string;
  centerLabel?: string;
  rightLabel?: string;
  labelClassName?: string;
}

export function ProgressBarWithLabels({
  progress,
  leftLabel,
  centerLabel,
  rightLabel,
  className,
  labelClassName = "text-sm text-gray-600",
  ...props
}: ProgressBarWithLabelsProps) {
  return (
    <div className={className}>
      <ProgressBar progress={progress} className="mb-2" {...props} />
      
      <div className="flex justify-between">
        {leftLabel && <span className={labelClassName}>{leftLabel}</span>}
        {centerLabel && <span className={labelClassName}>{centerLabel}</span>}
        {rightLabel && <span className={labelClassName}>{rightLabel}</span>}
      </div>
    </div>
  );
}
