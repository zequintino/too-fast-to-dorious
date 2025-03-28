import { ChangeEvent } from "react";

interface TimerInputsProps {
  values: { hours: string; minutes: string; seconds: string };
  onChange: (e: ChangeEvent<HTMLInputElement>, field: 'hours' | 'minutes' | 'seconds') => void;
  readonly?: boolean;
}

export default function TimerInputs({ values, onChange, readonly = false }: TimerInputsProps) {
  return (
    <div className="timer-input-fields">
      <input
        type="text"
        className="time-input"
        value={values.hours}
        onChange={(e) => onChange(e, 'hours')}
        readOnly={readonly}
        aria-label="Hours"
      />
      <span className="time-separator">:</span>
      <input
        type="text"
        className="time-input"
        value={values.minutes}
        onChange={(e) => onChange(e, 'minutes')}
        readOnly={readonly}
        aria-label="Minutes"
      />
      <span className="time-separator">:</span>
      <input
        type="text"
        className="time-input"
        value={values.seconds}
        onChange={(e) => onChange(e, 'seconds')}
        readOnly={readonly}
        aria-label="Seconds"
      />
    </div>
  );
}
