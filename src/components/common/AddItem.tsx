import { forwardRef, ReactNode } from 'react';
import { CiSquarePlus, CiFloppyDisk } from "react-icons/ci";
import './AddItem.css';

interface AddItemProps {
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

const AddItem = forwardRef<HTMLInputElement, AddItemProps>(
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

export default AddItem;