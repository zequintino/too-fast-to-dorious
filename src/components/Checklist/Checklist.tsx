import { useState, useCallback } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import { Item } from "../../types";
import AddItem from "../Common/AddItem";
import ListItem from "../Common/ListItem";
import "../common/ListItemStyles.css";

const Checklist = () => {
  const [items, setItems] = useLocalStorage<Item[]>("app_checklist_items", []);
  const [newItem, setNewItem] = useState<string>("");

  const handleAddItem = useCallback(() => {
    if (!newItem.trim()) {
      alert("Please enter something to check...");
      return;
    }

    const itemToAdd: Item = {
      id: Date.now().toString(),
      text: newItem,
      completed: false
    };

    setItems(prevItems => [...prevItems, itemToAdd]);
    setNewItem("");
  }, [newItem, setItems]);

  const handleToggleItem = useCallback((id: string) => {
    setItems(prevItems => prevItems.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  }, [setItems]);

  const handleDeleteItem = useCallback((id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  }, [setItems]);

  return (
    <>
      <AddItem
        value={newItem}
        onChange={event => setNewItem(event.target.value)}
        onSubmit={handleAddItem}
        placeholder="Add something to check..."
      />

      {items.length > 0 && (
        items.map(item => (
          <ListItem
            key={item.id}
            item={item}
            onCheck={handleToggleItem}
            onDelete={handleDeleteItem}
            showStrikethrough={false}
          />
        ))
      )}
    </>
  );
}

export default Checklist;