import { useState, useRef, useCallback } from "react";
import { Item } from "../../types";
import Timer from "../Timer/Timer";
import ListItem from "../Common/ListItem";
import { useTimer, isTimerActive, isTimerCompleted } from "../../context/TimerContext";
import useLocalStorage from "../../hooks/useLocalStorage";
import AddItem from "../Common/AddItem";
import "./TodoList.css";

export default function TodoList() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [tasks, setTasks] = useLocalStorage<Item[]>("app_cachedTasks", []);
  const [input, setInput] = useState("");
  const [editTask, setEditTask] = useState({
    enabled: false,
    task: null as Item | null,
  });
  
  const { 
    timerStatus,
    setTimerStatus,
    inputVisible,
    setInputVisible
  } = useTimer();

  const handleTimerStart = useCallback(() => {
    setTimerStatus('active');
    setInputVisible(false);
  }, [setTimerStatus, setInputVisible]);

  const handleTimerEnd = useCallback(() => {
    setTimerStatus('completed');
    // Keep input hidden after timer ends
  }, [setTimerStatus]);

  const handleRefresh = useCallback(() => {
    // Clear all tasks
    setTasks([]);
    // Reset timer to idle state
    setTimerStatus('idle');
    // Make input visible again
    setInputVisible(true);
  }, [setTasks, setTimerStatus, setInputVisible]);

  const handleCheckTask = useCallback((id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, [setTasks]);

  const handleAddTask = useCallback(() => {
    if (isTimerActive(timerStatus)) return; // Disable when timer is active
    
    if (!input) {
      alert("Please enter something to do...");
      return;
    }
    if (editTask.enabled && editTask.task) {
      handleSaveEdit();
      return;
    }
    
    // Create a new ListItem
    const newItem: Item = {
      id: Date.now().toString(),
      text: input,
      completed: false
    };
    
    setTasks([...tasks, newItem]);
    setInput("");
  }, [timerStatus, input, editTask, setTasks, tasks]);

  const handleEditTask = useCallback((item: Item) => {
    if (isTimerActive(timerStatus)) return; // Disable when timer is active
    
    inputRef.current?.focus();
    setInput(item.text);
    setEditTask({
      enabled: true,
      task: item,
    });
  }, [timerStatus]);

  const handleSaveEdit = useCallback(() => {
    if (isTimerActive(timerStatus) || !editTask.task) return;
    
    const taskId = editTask.task.id;
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, text: input } : task
      )
    );
    setInput("");
    setEditTask({ enabled: false, task: null });
  }, [timerStatus, editTask.task, input, setTasks]);

  const handleDeleteTask = useCallback((id: string) => {
    if (isTimerActive(timerStatus)) return; // Disable when timer is active
    
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }, [timerStatus, setTasks]);

  // Check if there are any tasks
  const hasTasks = tasks.length > 0;

  // Compute derived boolean states for backward compatibility
  const timerIsActive = isTimerActive(timerStatus);
  const timerIsCompleted = isTimerCompleted(timerStatus);

  return (
    <div className="todo-container page" role="region" aria-label="Todo List">
      <Timer 
        isActive={timerIsActive}
        isCompleted={timerIsCompleted}
        onTimerStart={handleTimerStart}
        onTimerEnd={handleTimerEnd}
        onRefresh={handleRefresh}
        hasTasks={hasTasks}
      />
      
      {/* Only show input when inputVisible is true and timer is not active */}
      {!timerIsActive && inputVisible && (
        <AddItem
          inputRef={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onSubmit={handleAddTask}
          placeholder="Add something to do..."
          disabled={timerIsActive}
          isEdit={editTask.enabled}
        />
      )}
      
      {tasks.map((item) => (
        <ListItem 
          key={item.id}
          item={item}
          onCheck={handleCheckTask}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          timerStatus={timerStatus}
        />
      ))}
    </div>
  );
}
