import { useState, useEffect, useRef, ChangeEvent } from "react";
import { CiPlay1 } from "react-icons/ci";
import "./Timer.css";

interface TimerProps {
  onTimerStart: () => void;
  onTimerEnd: () => void;
  isActive: boolean;
  buttonText?: string;
}

export default function Timer({ onTimerStart, onTimerEnd, isActive, buttonText = "Start" }: TimerProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // Store values as strings to handle empty inputs better
  const [timerValues, setTimerValues] = useState({ 
    hours: "00", 
    minutes: "00", 
    seconds: "00" 
  });
  const [remainingTime, setRemainingTime] = useState(0);

  // Clean up timer on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Format the display time when active
  useEffect(() => {
    if (isActive) {
      const h = Math.floor(remainingTime / 3600);
      const m = Math.floor((remainingTime % 3600) / 60);
      const s = remainingTime % 60;
      
      setTimerValues({
        hours: h.toString().padStart(2, '0'),
        minutes: m.toString().padStart(2, '0'),
        seconds: s.toString().padStart(2, '0')
      });
    }
  }, [remainingTime, isActive]);
  
  // Handle direct input for time values
  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>, field: 'hours' | 'minutes' | 'seconds') => {
    // Allow empty string temporarily for easier deletion
    let inputValue = e.target.value;
    
    // Only allow numbers and empty strings
    if (inputValue !== '' && !/^\d+$/.test(inputValue)) {
      return;
    }
    
    // Convert to number for validation
    let numValue = inputValue === '' ? 0 : parseInt(inputValue);
    
    // Set limits based on field
    if (field === 'hours') {
      numValue = Math.min(numValue, 23);
    } else {
      numValue = Math.min(numValue, 59);
    }
    
    // Update the value - keep as string
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
    
    // Call onTimerStart in a setTimeout to avoid the React warning
    setTimeout(() => {
      onTimerStart();
      
      // Start the countdown interval
      timerRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            // Timer complete
            if (timerRef.current) clearInterval(timerRef.current);
            onTimerEnd();
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

  return (
    <div className="timer-container">
      <div className="timer-input-fields">
        <input
          type="text"
          className="time-input"
          value={timerValues.hours}
          onChange={(e) => handleTimeChange(e, 'hours')}
          readOnly={isActive}
        />
        <span className="time-separator">:</span>
        <input
          type="text"
          className="time-input"
          value={timerValues.minutes}
          onChange={(e) => handleTimeChange(e, 'minutes')}
          readOnly={isActive}
        />
        <span className="time-separator">:</span>
        <input
          type="text"
          className="time-input"
          value={timerValues.seconds}
          onChange={(e) => handleTimeChange(e, 'seconds')}
          readOnly={isActive}
        />
      </div>
      
      <button 
        onClick={handleStartClick} 
        className="timer-start-button"
        disabled={isActive}
      >
        <CiPlay1 /> {buttonText}
      </button>
    </div>
  );
}
