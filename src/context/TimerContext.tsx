import React, { createContext, useState, useContext } from 'react';

interface TimerContextType {
  isTimerActive: boolean;
  setTimerActive: (active: boolean) => void;
  isTimerCompleted: boolean;
  setTimerCompleted: (completed: boolean) => void;
  inputVisible: boolean;
  setInputVisible: (visible: boolean) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTimerActive, setTimerActive] = useState(false);
  const [isTimerCompleted, setTimerCompleted] = useState(false);
  const [inputVisible, setInputVisible] = useState(true);

  return (
    <TimerContext.Provider value={{
      isTimerActive,
      setTimerActive,
      isTimerCompleted,
      setTimerCompleted,
      inputVisible,
      setInputVisible
    }}>
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
