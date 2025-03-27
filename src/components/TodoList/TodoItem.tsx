import { Task } from "../../types";

interface TodoItemProps {
  item: Task;
  index: number;
  onCheck: (index: number) => void;
  onEdit: (item: Task) => void;
  onDelete: (text: string) => void;
}

export default function TodoItem({ item, index, onCheck, onEdit, onDelete }: TodoItemProps) {
  return (
    <section>
      <input
        type="checkbox"
        checked={item.done}
        onChange={() => onCheck(index)}
      />
      <span style={{ textDecoration: item.done ? "line-through" : "none" }}>
        {item.text}
      </span>
      <button onClick={() => onEdit(item)}>Edit</button>
      <button onClick={() => onDelete(item.text)}>Delete</button>
    </section>
  );
}
