import { useState, useEffect, useRef, ChangeEvent } from "react";
import { CiStopwatch, CiRedo } from "react-icons/ci";
import "./Timer.css";
import TimerInputs from "./TimerInputs";
import ProgressCar from "./ProgressCar";

interface TimerProps {
  onTimerStart: () => void;
  onTimerEnd: () => void;
  onRefresh?: () => void; // Add new prop for refresh action
  isActive: boolean;
  isCompleted?: boolean; // Add new prop to track timer completion
  hasTasks?: boolean; // New prop to track if there are any tasks
}

export default function Timer({
  onTimerStart,
  onTimerEnd,
  onRefresh,
  isActive,
  isCompleted = false,
  hasTasks = true, // Default to true for backward compatibility
}: TimerProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const carImageRef = useRef<HTMLImageElement>(null);
  const imageLoadedRef = useRef(false);

  const [timerValues, setTimerValues] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00"
  });
  const [remainingTime, setRemainingTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [progress, setProgress] = useState(0);

  // Handle image load in a useEffect instead of inline
  useEffect(() => {
    if (carImageRef.current && carImageRef.current.complete && !imageLoadedRef.current) {
      imageLoadedRef.current = true;
      setTimeout(() => {
        setProgress(prev => prev);
      }, 0);
    }
  });

  // Clean up timer on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Format the display time when active and calculate progress
  useEffect(() => {
    if (isActive && totalTime > 0) {
      const h = Math.floor(remainingTime / 3600);
      const m = Math.floor((remainingTime % 3600) / 60);
      const s = remainingTime % 60;

      setTimerValues({
        hours: h.toString().padStart(2, '0'),
        minutes: m.toString().padStart(2, '0'),
        seconds: s.toString().padStart(2, '0')
      });

      // Calculate progress percentage
      const elapsed = totalTime - remainingTime;
      const progressPercentage = Math.min(100, Math.max(0, (elapsed / totalTime) * 100));
      setProgress(progressPercentage);
    }
  }, [remainingTime, isActive, totalTime]);

  // Handle direct input for time values
  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>, field: 'hours' | 'minutes' | 'seconds') => {
    let inputValue = e.target.value;

    if (inputValue !== '' && !/^\d+$/.test(inputValue)) {
      return;
    }

    let numValue = inputValue === '' ? 0 : parseInt(inputValue);

    if (field === 'hours') {
      numValue = Math.min(numValue, 23);
    } else {
      numValue = Math.min(numValue, 59);
    }

    setTimerValues({
      ...timerValues,
      [field]: inputValue === '' ? '' : numValue.toString()
    });
  };

  // Function to start the timer
  const startTimer = () => {
    // Convert string values to numbers, treating empty strings as 0
    const hours = timerValues.hours === '' ? 0 : parseInt(timerValues.hours);
    const minutes = timerValues.minutes === '' ? 0 : parseInt(timerValues.minutes);
    const seconds = timerValues.seconds === '' ? 0 : parseInt(timerValues.seconds);

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    if (totalSeconds <= 0) {
      alert("Please set a valid time greater than 0");
      return;
    }

    setRemainingTime(totalSeconds);
    setTotalTime(totalSeconds); // Store the total time for progress calculation
    setProgress(0); // Reset progress

    // Call onTimerStart in a setTimeout to avoid the React warning
    setTimeout(() => {
      onTimerStart();

      // Start the countdown interval
      timerRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);

            // Set progress to 100% to ensure car reaches end position
            setProgress(100);

            // Add a delay before calling onTimerEnd to allow animation to complete
            setTimeout(() => {
              onTimerEnd();
            }, 1000);

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 0);
  };

  // Before starting, make sure to format any empty inputs as "00"
  const handleStartClick = () => {
    const formattedValues = {
      hours: timerValues.hours === '' ? '00' : parseInt(timerValues.hours).toString().padStart(2, '0'),
      minutes: timerValues.minutes === '' ? '00' : parseInt(timerValues.minutes).toString().padStart(2, '0'),
      seconds: timerValues.seconds === '' ? '00' : parseInt(timerValues.seconds).toString().padStart(2, '0')
    };

    setTimerValues(formattedValues);
    startTimer();
  };

  // Add a new handler for refresh button click
  const handleRefreshClick = () => {
    // Reset progress to move car back to start position
    setProgress(0);

    // Reset timer values to initial state
    setTimerValues({
      hours: "00",
      minutes: "00",
      seconds: "00"
    });

    // Call the parent component's refresh handler
    if (onRefresh) {
      onRefresh();
    }
  };

  // Check if any time has been entered (all fields are not zero)
  const hasTimeEntered = () => {
    const hours = parseInt(timerValues.hours || '0');
    const minutes = parseInt(timerValues.minutes || '0');
    const seconds = parseInt(timerValues.seconds || '0');

    return hours > 0 || minutes > 0 || seconds > 0;
  };

  return (
    <div className="timer-container">
      <TimerInputs
        values={timerValues}
        onChange={handleTimeChange}
        readonly={isActive || isCompleted}
      />

      <ProgressCar
        progress={progress}
        containerRef={progressContainerRef}
        carRef={carImageRef}
      />

      <button
        onClick={isCompleted ? handleRefreshClick : handleStartClick}
        className={isCompleted ? "timer-refresh-button" : "timer-start-button"}
        disabled={
          isActive ||
          (!hasTasks && !isCompleted) ||
          (!hasTimeEntered() && !isCompleted)
        }
        title={
          !hasTasks && !isCompleted
            ? "Add tasks before starting timer"
            : !hasTimeEntered() && !isCompleted
              ? "Set time before starting timer"
              : ""
        }
      >
        {isCompleted ? <CiRedo /> : <CiStopwatch />}
      </button>
    </div>
  );
}
