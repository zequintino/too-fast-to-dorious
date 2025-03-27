import { useState, useEffect, useRef } from "react";
import CheckupItem from "./CheckupItem";

interface Checkup {
  id: string;
  text: string;
  checked: boolean;
}

export default function CheckupList() {
  const firstRender = useRef(true);
  const [checkups, setCheckups] = useState<Checkup[]>([]);
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
    
    const newItem: Checkup = {
      id: Date.now().toString(),
      text: newCheckup,
      checked: false
    };
    
    setCheckups([...checkups, newItem]);
    setNewCheckup("");
  };

  const toggleCheckup = (id: string) => {
    setCheckups(checkups.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const removeCheckup = (id: string) => {
    setCheckups(checkups.filter(item => item.id !== id));
  };

  return (
    <div className="checkup-container">
      <h2>Home Checkups</h2>
      <p>Add items you need to check before leaving home</p>
      
      <div className="add-checkup">
        <input
          type="text"
          value={newCheckup}
          onChange={(e) => setNewCheckup(e.target.value)}
          placeholder="Add new checkup item..."
        />
        <button onClick={handleAddCheckup}>Add</button>
      </div>
      
      <div className="checkup-items">
        {checkups.map(item => (
          <CheckupItem 
            key={item.id} 
            checkup={item} 
            onToggle={toggleCheckup} 
            onDelete={removeCheckup} 
          />
        ))}
      </div>
    </div>
  );
}
