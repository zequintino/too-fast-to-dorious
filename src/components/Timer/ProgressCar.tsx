import { RefObject } from "react";
import supraMk4 from "../../assets/supra-mk4.png";

interface ProgressCarProps {
  progress: number;
  containerRef: RefObject<HTMLDivElement>;
  carRef: RefObject<HTMLImageElement>;
}

export default function ProgressCar({ progress, containerRef, carRef }: ProgressCarProps) {
  const calculatePosition = (percentage: number) => {
    if (!containerRef.current || !carRef.current) return 0;
    
    const containerWidth = containerRef.current.clientWidth;
    const carWidth = carRef.current.clientWidth;
    const maxPosition = containerWidth - carWidth;
    
    return (maxPosition * percentage) / 100;
  };

  return (
    <div className="timer-progress-container" ref={containerRef}>
      <div 
        className="progress-car"
        style={{ left: `${calculatePosition(progress)}px` }}
      >
        <img 
          ref={carRef}
          src={supraMk4} 
          alt="Timer progress" 
        />
      </div>
    </div>
  );
}
