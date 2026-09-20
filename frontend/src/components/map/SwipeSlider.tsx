import React, { useRef, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, Split } from "lucide-react";
import { useFloodStore } from "@/store/useFloodStore";

interface SwipeSliderProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

export const SwipeSlider: React.FC<SwipeSliderProps> = ({ containerRef }) => {
  const { swipePosition, setSwipePosition } = useFloodStore();
  const isDragging = useRef(false);

  const updatePosition = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      setSwipePosition(percentage);
    },
    [containerRef, setSwipePosition]
  );

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      updatePosition(e.clientX);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || e.touches.length === 0) return;
      updatePosition(e.touches[0].clientX);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [updatePosition]);

  return (
    <>
      {/* Floating Tactical Labels */}
      <div 
        className="absolute top-4 left-4 z-20 pointer-events-none px-3 py-1 rounded bg-tactical-950/80 backdrop-blur-md border border-slate-700/80 text-[11px] font-mono text-slate-200 flex items-center space-x-1.5 shadow-lg"
      >
        <span className="w-2 h-2 rounded-full bg-blue-400"></span>
        <span>PRE-FLOOD BASELINE (OPTICAL / SAR σ⁰)</span>
      </div>

      <div 
        className="absolute top-4 right-4 z-20 pointer-events-none px-3 py-1 rounded bg-tactical-950/80 backdrop-blur-md border border-tactical-cyan/60 text-[11px] font-mono text-tactical-cyan flex items-center space-x-1.5 shadow-glow-cyan"
      >
        <span className="w-2 h-2 rounded-full bg-tactical-cyan animate-pulse"></span>
        <span>POST-FLOOD EVENT + AI RESUNET INUNDATION</span>
      </div>

      {/* Draggable Vertical Divider */}
      <div
        className="absolute top-0 bottom-0 z-20 w-1 bg-gradient-to-b from-tactical-cyan via-white to-tactical-cyan shadow-[0_0_12px_rgba(0,240,255,0.8)] cursor-ew-resize select-none"
        style={{ left: `${swipePosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {/* Grab Handle Button */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-tactical-950 border-2 border-tactical-cyan text-tactical-cyan flex items-center justify-center shadow-glow-cyan hover:scale-110 active:scale-95 transition-transform cursor-grab active:cursor-grabbing">
          <div className="flex items-center space-x-0.5">
            <ChevronLeft className="w-4 h-4 -mr-1 text-slate-300" />
            <Split className="w-3.5 h-3.5 text-tactical-cyan" />
            <ChevronRight className="w-4 h-4 -ml-1 text-tactical-cyan" />
          </div>
        </div>

        {/* Position Badge at bottom */}
        <div className="absolute bottom-6 -translate-x-1/2 px-2 py-0.5 rounded bg-tactical-950/90 border border-slate-700 text-[10px] font-mono text-slate-300 pointer-events-none whitespace-nowrap shadow-md">
          {Math.round(swipePosition)}% Split
        </div>
      </div>
    </>
  );
};
