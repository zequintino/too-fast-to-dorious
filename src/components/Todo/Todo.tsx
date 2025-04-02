import { useState, useRef, useCallback } from "react";
import { CiSquarePlus, CiFloppyDisk } from "react-icons/ci";
import "./Todo.css";
import TodoItem from "./TodoItem";
import Timer from "../Timer/Timer";
import { useTimer, isTimerActive, isTimerCompleted } from "../../context/TimerContext";
import { Task } from "../../types";
import useLocalStorage from "../../hooks/useLocalStorage";

export default function Todo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [tasks, setTasks] = useLocalStorage<Task[]>("app_cachedTasks", []);
  const [input, setInput] = useState("");
  const [editTask, setEditTask] = useState({
    enabled: false,
    task: "",
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

  const handleCheckTask = useCallback((index: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, done: !task.done } : task
      )
    );
  }, [setTasks]);

  const handleAddTask = useCallback(() => {
    if (isTimerActive(timerStatus)) return; // Disable when timer is active
    
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
  }, [timerStatus, input, editTask, setTasks]);

  const handleEditTask = useCallback((item: Task) => {
    if (isTimerActive(timerStatus)) return; // Disable when timer is active
    
    inputRef.current?.focus();
    setInput(item.text);
    setEditTask({
      enabled: true,
      task: item.text,
    });
  }, [timerStatus]);

  const handleSaveEdit = useCallback(() => {
    if (isTimerActive(timerStatus)) return; // Disable when timer is active
    
    const editedTasks = tasks.map((task) =>
      task.text === editTask.task ? { ...task, text: input } : task
    );
    setTasks(editedTasks);
    setInput("");
    setEditTask({ enabled: false, task: "" });
  }, [timerStatus, tasks, editTask, input, setTasks]);

  const handleDeleteTask = useCallback((item: string) => {
    if (isTimerActive(timerStatus)) return; // Disable when timer is active
    
    const newTasks = tasks.filter((task) => task.text !== item);
    setTasks(newTasks);
  }, [timerStatus, tasks, setTasks]);

  // Check if there are any tasks
  const hasTasks = tasks.length > 0;

  // Compute derived boolean states for backward compatibility
  const timerIsActive = isTimerActive(timerStatus);
  const timerIsCompleted = isTimerCompleted(timerStatus);

  return (
    <div className="todo-container" role="region" aria-label="Todo List">
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
        <div className="todo-input-area">
          <input
            ref={inputRef}
            value={input}
            placeholder="Add a to-do..."
            onChange={(e) => setInput(e.target.value)}
            disabled={timerIsActive}
          />
          <button onClick={handleAddTask} disabled={timerIsActive}>
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
          timerStatus={timerStatus} // Pass the single status instead of two booleans
        />
      ))}
    </div>
  );
}
