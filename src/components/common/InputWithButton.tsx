import { forwardRef, ReactNode } from 'react';
import { CiSquarePlus, CiFloppyDisk } from "react-icons/ci";
import './InputWithButton.css';

interface InputWithButtonProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  isEdit?: boolean;
  className?: string;
  buttonIcon?: ReactNode;
  inputRef?: React.RefObject<HTMLInputElement>;
}

// Create a reusable component for input with button that can be used in both Todo and Checklist
const InputWithButton = forwardRef<HTMLInputElement, InputWithButtonProps>(
  ({ 
    value, 
    onChange, 
    onSubmit, 
    placeholder = "Add an item...", 
    disabled = false, 
    isEdit = false,
    className = "",
    buttonIcon,
    inputRef
  }, ref) => {
    
    // Handle key press events (Enter to submit)
    const handleOnKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !disabled) {
        onSubmit();
      }
    };

    // Get the appropriate icon for the button
    const getButtonIcon = () => {
      if (buttonIcon) {
        return buttonIcon;
      }
      return isEdit ? <CiFloppyDisk /> : <CiSquarePlus />;
    };

    return (
      <div className={`input-with-button ${className}`}>
        <input
          ref={inputRef || ref}
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={handleOnKeyDown}
          placeholder={placeholder}
          disabled={disabled}
        />
        <button 
          onClick={onSubmit}
          disabled={disabled}
          aria-label={isEdit ? "Save item" : "Add item"}
        >
          {getButtonIcon()}
        </button>
      </div>
    );
  }
);

// Set display name for better debugging
InputWithButton.displayName = 'InputWithButton';

export default InputWithButton;