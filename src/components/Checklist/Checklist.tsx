import { useState, useEffect, useRef } from "react";
import TodoItem from "../Todo/TodoItem";
import { ListItem } from "../../types";
import InputWithButton from "../common/InputWithButton";
import "../common/ListStyles.css"; // Import shared styles

export default function CheckupList() {
  const firstRender = useRef(true);
  const [checkups, setCheckups] = useState<ListItem[]>([]);
  const [newCheckup, setNewCheckup] = useState("");

  useEffect(() => {
    if (firstRender.current) {
      const savedCheckups = localStorage.getItem("app_checkups");
      if (savedCheckups) setCheckups(JSON.parse(savedCheckups));
      firstRender.current = false;
      return;
    }
    localStorage.setItem("app_checkups", JSON.stringify(checkups));
  }, [checkups]);

  const handleAddCheckup = () => {
    if (!newCheckup.trim()) {
      alert("Please enter a checkup item...");
      return;
    }

    const newItem: ListItem = {
      id: Date.now().toString(),
      text: newCheckup,
      completed: false
    };

    setCheckups([...checkups, newItem]);
    setNewCheckup("");
  };

  const handleCheckTask = (id: string) => {
    setCheckups(prev => prev.map((item) => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleDeleteTask = (id: string) => {
    setCheckups(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="checkup-container">
      <InputWithButton
        value={newCheckup}
        onChange={(e) => setNewCheckup(e.target.value)}
        onSubmit={handleAddCheckup}
        placeholder="Add a check..."
        className="add-checkup"
      />

      <div className="checkup-items">
        {checkups.map((item) => (
          <TodoItem
            key={item.id}
            item={item}
            onCheck={handleCheckTask}
            onDelete={handleDeleteTask}
            showStrikethrough={false} // Disable strikethrough for checklist items
          />
        ))}
      </div>
    </div>
  );
}
