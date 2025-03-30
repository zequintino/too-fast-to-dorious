import { useState, useRef, useCallback } from "react";
import { CiSquarePlus, CiFloppyDisk } from "react-icons/ci";
import "./TodoList.css";
import TodoItem from "./TodoItem";
import Timer from "../Timer/Timer";
import { useTimer } from "../../context/TimerContext";
import { Task } from "../../types";
import useLocalStorage from "../../hooks/useLocalStorage";

export default function TodoList() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [tasks, setTasks] = useLocalStorage<Task[]>("app_cachedTasks", []);
  const [input, setInput] = useState("");
  const [editTask, setEditTask] = useState({
    enabled: false,
    task: "",
  });
  
  // Use global timer context
  const { 
    isTimerActive, 
    setTimerActive, 
    isTimerCompleted, 
    setTimerCompleted,
    inputVisible,
    setInputVisible
  } = useTimer();

  const handleTimerStart = useCallback(() => {
    setTimerActive(true);
    setTimerCompleted(false);
    setInputVisible(false); // Hide input when timer starts
  }, [setTimerActive, setTimerCompleted, setInputVisible]);

  const handleTimerEnd = useCallback(() => {
    setTimerActive(false);
    setTimerCompleted(true);
    // Keep input hidden after timer ends
  }, [setTimerActive, setTimerCompleted]);

  // Update refresh handler to show input again
  const handleRefresh = useCallback(() => {
    // Clear all tasks
    setTasks([]);
    // Reset timer completion state
    setTimerCompleted(false);
    // Make input visible again
    setInputVisible(true);
  }, [setTasks, setTimerCompleted, setInputVisible]);

  const handleCheckTask = useCallback((index: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, done: !task.done } : task
      )
    );
  }, [setTasks]);

  const handleAddTask = useCallback(() => {
    if (isTimerActive) return; // Disable when timer is active
    
    if (!input) {
      alert("Please enter a To-do...");
      return;
    }
    if (editTask.enabled) {
      handleSaveEdit();
      return;
    }
    setTasks([...tasks, { text: input, done: false }]);
    setInput("");
  }, [isTimerActive, input, editTask, setTasks]);

  const handleEditTask = useCallback((item: Task) => {
    if (isTimerActive) return; // Disable when timer is active
    
    inputRef.current?.focus();
    setInput(item.text);
    setEditTask({
      enabled: true,
      task: item.text,
    });
  }, [isTimerActive]);

  const handleSaveEdit = useCallback(() => {
    if (isTimerActive) return; // Disable when timer is active
    
    const editedTasks = tasks.map((task) =>
      task.text === editTask.task ? { ...task, text: input } : task
    );
    setTasks(editedTasks);
    setInput("");
    setEditTask({ enabled: false, task: "" });
  }, [isTimerActive, tasks, editTask, input, setTasks]);

  const handleDeleteTask = useCallback((item: string) => {
    if (isTimerActive) return; // Disable when timer is active
    
    const newTasks = tasks.filter((task) => task.text !== item);
    setTasks(newTasks);
  }, [isTimerActive, tasks, setTasks]);

  // Check if there are any tasks
  const hasTasks = tasks.length > 0;

  return (
    <div className="todo-container" role="region" aria-label="Todo List">
      <Timer 
        isActive={isTimerActive}
        isCompleted={isTimerCompleted}
        onTimerStart={handleTimerStart}
        onTimerEnd={handleTimerEnd}
        onRefresh={handleRefresh}
        hasTasks={hasTasks} // Pass the hasTasks flag
      />
      
      {/* Only show input when inputVisible is true (and timer is not active) */}
      {!isTimerActive && inputVisible && (
        <div className="todo-input-area">
          <input
            ref={inputRef}
            value={input}
            placeholder="Add a ToDorious..."
            onChange={(e) => setInput(e.target.value)}
            disabled={isTimerActive}
          />
          <button onClick={handleAddTask} disabled={isTimerActive}>
            {editTask.enabled ? <CiFloppyDisk /> : <CiSquarePlus />}
          </button>
        </div>
      )}
      
      {tasks.map((item, index) => (
        <TodoItem 
          key={index}
          item={item}
          index={index}
          onCheck={handleCheckTask}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          timerActive={isTimerActive}
          timerCompleted={isTimerCompleted} // Pass the timer completed state from context
        />
      ))}
    </div>
  );
}
