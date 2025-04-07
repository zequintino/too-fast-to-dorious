import { memo } from 'react';
import { ListItem } from "../../types";
import { CiEdit, CiTrash, CiSquareCheck, CiStop1 } from "react-icons/ci";
import { TimerStatus, isTimerActive, isTimerCompleted } from "../../context/TimerContext";
import "../common/ListStyles.css"; // Import shared styles

interface TodoItemProps {
  item: ListItem;
  onCheck: (id: string) => void;
  onEdit?: (item: ListItem) => void;
  onDelete: (id: string) => void;
  timerStatus?: TimerStatus;
  showStrikethrough?: boolean;
}

// Using memo to prevent unnecessary re-renders for performance optimization
const TodoItem = memo(function TodoItem({ 
  item, 
  onCheck, 
  onEdit, 
  onDelete, 
  timerStatus = 'idle',
  showStrikethrough = true
}: TodoItemProps) {
  // Derive state from props
  const timerActive = isTimerActive(timerStatus);
  const timerCompleted = isTimerCompleted(timerStatus);
  
  // Handle item click (toggle completion)
  const handleClick = () => {
    if (timerCompleted) return;
    onCheck(item.id);
  };

  // Handle edit button click
  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onEdit) onEdit(item);
  };

  // Handle delete button click
  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete(item.id);
  };

  // Compute class names using shared classes
  const itemClassName = [
    'list-item',
    item.completed ? 'completed' : '',
    !item.completed && timerCompleted ? 'timer-expired' : '',
    timerCompleted ? 'no-interact' : ''
  ].filter(Boolean).join(' ');

  return (
    <section 
      className={itemClassName}
      onClick={handleClick}
      role="listitem"
      aria-checked={item.completed}
    >
      <div className="list-item-icon" aria-hidden="true">
        {item.completed ? <CiSquareCheck /> : <CiStop1 />}
      </div>
      
      <span 
        className={`list-item-content${item.completed ? ' completed' : ''}`}
        style={{ 
          textDecoration: item.completed && showStrikethrough ? "line-through" : "none"
        }}
      >
        {item.text}
      </span>
      
      {/* Conditionally render action buttons */}
      {!timerActive && !timerCompleted && (
        <div className="list-item-buttons">
          {onEdit && (
            <button 
              className="icon-button" 
              onClick={handleEditClick}
              aria-label={`Edit task: ${item.text}`}
            >
              <CiEdit />
            </button>
          )}
          <button 
            className="icon-button danger" 
            onClick={handleDeleteClick}
            aria-label={`Delete task: ${item.text}`}
          >
            <CiTrash />
          </button>
        </div>
      )}
    </section>
  );
});

export default TodoItem;
