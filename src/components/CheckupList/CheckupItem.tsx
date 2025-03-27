import { CiTrash } from "react-icons/ci";

interface CheckupItemProps {
  checkup: {
    id: string;
    text: string;
    checked: boolean;
  };
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function CheckupItem({ checkup, onToggle, onDelete }: CheckupItemProps) {
  return (
    <div 
      className={`checkup-item ${checkup.checked ? 'checked' : ''}`}
      onClick={() => onToggle(checkup.id)}
    >
      <span>{checkup.text}</span>
      <button 
        className="icon-button danger"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(checkup.id);
        }}
      >
        <CiTrash />
      </button>
    </div>
  );
}
