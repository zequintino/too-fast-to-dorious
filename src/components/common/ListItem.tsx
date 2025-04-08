import { memo } from 'react';
import { Item } from "../../types";
import { CiEdit, CiTrash, CiSquareCheck, CiStop1 } from "react-icons/ci";
import { TimerStatus, isTimerActive, isTimerCompleted } from "../../context/TimerContext";
import "./ListItemStyles.css";

interface ListItemProps {
  item: Item;
  onCheck: (id: string) => void;
  onEdit?: (item: Item) => void;
  onDelete: (id: string) => void;
  timerStatus?: TimerStatus;
  showStrikethrough?: boolean;
}

const ListItem = memo(function ListItem({
  item,
  onCheck,
  onEdit,
  onDelete,
  timerStatus = 'idle',
  showStrikethrough = true
}: ListItemProps) {
  const timerActive = isTimerActive(timerStatus);
  const timerCompleted = isTimerCompleted(timerStatus);

  const handleClick = () => {
    if (timerCompleted) return;
    onCheck(item.id);
  };

  const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (onEdit) onEdit(item);
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDelete(item.id);
  };

  const itemClassName = [
    'list-item',
    item.completed ? 'completed' : '',
    !item.completed && timerCompleted ? 'timer-expired' : '',
    timerCompleted ? 'no-interact' : ''
  ].filter(Boolean).join(' ');

  const contentClassName = [
    'list-item-content',
    item.completed && showStrikethrough ? 'with-strikethrough' : ''
  ].filter(Boolean).join(' ');

  return (
    <section
      className={itemClassName}
      onClick={handleClick}
      role="listitem"
      aria-checked={item.completed}
    >
      <div className="list-item-icon">
        {item.completed ? <CiSquareCheck /> : <CiStop1 />}
      </div>

      <span className={contentClassName}>
        {item.text}
      </span>

      {!timerActive && !timerCompleted && (
        <div className="list-item-buttons">
          {onEdit && (
            <button
              className="icon-button"
              onClick={handleEditClick}
              aria-label={`Edit item: ${item.text}`}
            >
              <CiEdit />
            </button>
          )}
          <button
            className="icon-button danger"
            onClick={handleDeleteClick}
            aria-label={`Delete item: ${item.text}`}
          >
            <CiTrash />
          </button>
        </div>
      )}
    </section>
  );
});

export default ListItem;
