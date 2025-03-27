import React, { createContext, useState, useContext } from 'react';

interface TimerContextType {
  isTimerActive: boolean;
  setTimerActive: (active: boolean) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isTimerActive, setTimerActive] = useState(false);

  return (
    <TimerContext.Provider value={{ isTimerActive, setTimerActive }}>
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
