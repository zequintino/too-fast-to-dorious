import { Task } from "../../types";
import { CiEdit, CiTrash, CiSquareCheck, CiStop1 } from "react-icons/ci";

interface TodoItemProps {
  item: Task;
  index: number;
  onCheck: (index: number) => void;
  onEdit: (item: Task) => void;
  onDelete: (text: string) => void;
  timerActive: boolean;
}

export default function TodoItem({ item, index, onCheck, onEdit, onDelete, timerActive }: TodoItemProps) {
  const handleClick = () => {
    onCheck(index);
  };

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <section 
      className={`todo-item ${item.done ? 'checked' : ''}`}
      onClick={handleClick}
    >
      <div className="todo-check-icon">
        {item.done ? <CiSquareCheck /> : <CiStop1 />}
      </div>
      <span style={{ textDecoration: item.done ? "line-through" : "none" }}>
        {item.text}
      </span>
      {!timerActive && (
        <>
          <button 
            className="icon-button" 
            onClick={(e) => handleButtonClick(e, () => onEdit(item))}
          >
            <CiEdit />
          </button>
          <button 
            className="icon-button danger" 
            onClick={(e) => handleButtonClick(e, () => onDelete(item.text))}
          >
            <CiTrash />
          </button>
        </>
      )}
    </section>
  );
}
