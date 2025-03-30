import { Task } from "../../types";
import { CiEdit, CiTrash, CiSquareCheck, CiStop1 } from "react-icons/ci";

interface TodoItemProps {
  item: Task;
  index: number;
  onCheck: (index: number) => void;
  onEdit: (item: Task) => void;
  onDelete: (text: string) => void;
  timerActive: boolean;
  timerCompleted: boolean; // Add new prop
}

export default function TodoItem({ 
  item, 
  index, 
  onCheck, 
  onEdit, 
  onDelete, 
  timerActive,
  timerCompleted 
}: TodoItemProps) {
  const handleClick = () => {
    // Prevent toggling tasks if timer has completed
    if (timerCompleted) return;
    
    onCheck(index);
  };

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  // Determine CSS classes based on state
  const getItemClasses = () => {
    let classes = 'todo-item';
    
    if (item.done) {
      classes += ' checked';
    } else if (timerCompleted) {
      classes += ' timer-expired';
    }
    
    // Add a class to show it's not interactive when timer is completed
    if (timerCompleted) {
      classes += ' no-interact';
    }
    
    return classes;
  };

  return (
    <section 
      className={getItemClasses()}
      onClick={handleClick}
      role="listitem"
      aria-checked={item.done}
    >
      <div className="todo-check-icon" aria-hidden="true">
        {item.done ? <CiSquareCheck /> : <CiStop1 />}
      </div>
      <span style={{ textDecoration: item.done ? "line-through" : "none" }}>
        {item.text}
      </span>
      {/* Hide buttons when timer is active OR timer has completed */}
      {!timerActive && !timerCompleted && (
        <div className="todo-item-buttons">
          <button 
            className="icon-button" 
            onClick={(e) => handleButtonClick(e, () => onEdit(item))}
            aria-label={`Edit task: ${item.text}`}
          >
            <CiEdit />
          </button>
          <button 
            className="icon-button danger" 
            onClick={(e) => handleButtonClick(e, () => onDelete(item.text))}
            aria-label={`Delete task: ${item.text}`}
          >
            <CiTrash />
          </button>
        </div>
      )}
    </section>
  );
}
