import React, { createContext, useState, useContext } from 'react';


export type TimerStatus = 'idle' | 'active' | 'completed';

interface TimerContextType {
  timerStatus: TimerStatus;
  setTimerStatus: (status: TimerStatus) => void;
  inputVisible: boolean;
  setInputVisible: (visible: boolean) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timerStatus, setTimerStatus] = useState<TimerStatus>('idle');
  const [inputVisible, setInputVisible] = useState(true);

  return (
    <TimerContext.Provider
      value={{
        timerStatus,
        setTimerStatus,
        inputVisible,
        setInputVisible
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};

export const isTimerActive = (status: TimerStatus): boolean => status === 'active';
export const isTimerCompleted = (status: TimerStatus): boolean => status === 'completed';
export const isTimerIdle = (status: TimerStatus): boolean => status === 'idle';
