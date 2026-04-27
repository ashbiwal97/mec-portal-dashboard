'use client';

import { getHealthZone, healthZone } from '@/lib/tokens';

interface RadialGaugeProps {
  score: number;
  label: string;
  color: string;
  size?: number;
}

export function RadialGauge({ score, label, color, size = 88 }: RadialGaugeProps) {
  const zone = getHealthZone(score);
  const zoneData = healthZone[zone];

  const cx = size / 2;
  const cy = size / 2;
  const r = (size - 14) / 2;
  const circumference = 2 * Math.PI * r;
  // Show 270° of arc (from 135° to 405°, leaving 90° gap at bottom)
  const arcLength = circumference * 0.75;
  const filled = (score / 100) * arcLength;
  const gap = circumference - arcLength;

  // strokeDasharray: filled, unfilled within arc, gap outside arc
  const filledDash = `${filled} ${circumference - filled}`;
  // track dash: full arc
  const trackDash = `${arcLength} ${gap}`;

  return (
    <div className="flex flex-col items-center gap-2 group cursor-default">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="rotate-[135deg]"
          aria-label={`${label}: ${score} out of 100, ${zoneData.label}`}
          role="img"
        >
          {/* Background track */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="8"
            strokeDasharray={trackDash}
            strokeLinecap="round"
          />
          {/* Filled arc */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={filledDash}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
        </svg>
        {/* Score in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center mt-1">
          <span className="text-base font-bold text-[#231F20] leading-none">{score}</span>
          <span
            className="text-[9px] font-semibold mt-0.5 uppercase tracking-wide"
            style={{ color: zoneData.color }}
          >
            {zoneData.label}
          </span>
        </div>
      </div>
      <p className="text-[11px] font-medium text-[#363553] text-center leading-[14px] max-w-[96px]">{label}</p>

      {/* Hover tooltip */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute mt-1 bg-[#062026] text-white text-[11px] px-2 py-1 rounded-md pointer-events-none z-10 whitespace-nowrap">
        {zoneData.range}: {zoneData.label}
      </div>
    </div>
  );
}
