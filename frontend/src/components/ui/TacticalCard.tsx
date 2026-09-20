import React from "react";
import { clsx } from "clsx";

interface TacticalCardProps {
  title?: string;
  badge?: string;
  badgeColor?: "cyan" | "crimson" | "amber" | "emerald";
  className?: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
}

export const TacticalCard: React.FC<TacticalCardProps> = ({
  title,
  badge,
  badgeColor = "cyan",
  className,
  children,
  headerAction
}) => {
  const badgeColors = {
    cyan: "bg-tactical-cyan/10 text-tactical-cyan border-tactical-cyan/40",
    crimson: "bg-tactical-crimson/10 text-tactical-crimson border-tactical-crimson/40",
    amber: "bg-tactical-amber/10 text-tactical-amber border-tactical-amber/40",
    emerald: "bg-tactical-emerald/10 text-tactical-emerald border-tactical-emerald/40",
  };

  return (
    <div
      className={clsx(
        "relative rounded-lg border border-slate-800 bg-tactical-900/90 backdrop-blur-md shadow-tactical-card transition-all duration-200 overflow-hidden",
        className
      )}
    >
      {/* Top corner tactical cyber-brackets */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-tactical-cyan/50 pointer-events-none" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-tactical-cyan/50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-tactical-cyan/50 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-tactical-cyan/50 pointer-events-none" />

      {title && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/80 bg-tactical-950/60">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-tactical-cyan animate-pulse" />
            <h3 className="text-xs font-mono font-semibold tracking-wider text-slate-200 uppercase">
              {title}
            </h3>
            {badge && (
              <span className={clsx("text-[10px] font-mono px-2 py-0.5 rounded border", badgeColors[badgeColor])}>
                {badge}
              </span>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      <div className="p-4">{children}</div>
    </div>
  );
};
