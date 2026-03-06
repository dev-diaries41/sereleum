import { useId } from "react";

export const GradientWave = ({
  flip = false,
  opacity = 0.2,
  className = "",
}: {
  flip?: boolean;
  opacity?: number;
  className?: string;
}) => {
    const gradientId = useId();

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${flip ? "rotate-180" : ""} ${className}`}
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="w-[120%] -left-[10%] relative h-full wave-animate"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>

        <path
          fill={`url(#${gradientId})`}
          d="
          M0,160
          C240,220 480,100 720,160
          C960,220 1200,100 1440,160
          L1440,320
          L0,320
          Z"
        />
      </svg>
    </div>
  );
}