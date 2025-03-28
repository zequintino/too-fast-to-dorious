import { useState, useRef, useMemo, useCallback } from "react";
import { CiSquarePlus, CiSaveDown1 } from "react-icons/ci";
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
  
  const { isTimerActive, setTimerActive } = useTimer();
  const [timerCompleted, setTimerCompleted] = useState(false);

  const tasksCount = useMemo(() => {
    return `${!tasks.length ? "no ToDorious available..." : ""}`;
  }, [tasks]);

  const handleTimerStart = useCallback(() => {
    setTimerActive(true);
    setTimerCompleted(false);
  }, [setTimerActive]);

  const handleTimerEnd = useCallback(() => {
    setTimerActive(false);
    setTimerCompleted(true);
  }, [setTimerActive]);

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

  return (
    <div className="todo-container" role="region" aria-label="Todo List">
      <Timer 
        isActive={isTimerActive}
        onTimerStart={handleTimerStart}
        onTimerEnd={handleTimerEnd}
      />
      
      {!isTimerActive && (
        <div className="todo-input-area">
          <input
            ref={inputRef}
            value={input}
            placeholder="Add a ToDorious..."
            onChange={(e) => setInput(e.target.value)}
            disabled={isTimerActive}
          />
          <button onClick={handleAddTask} disabled={isTimerActive}>
            {editTask.enabled ? <CiSaveDown1 /> : <CiSquarePlus />}
          </button>
        </div>
      )}
      
      <p style={{textAlign: "center"}}><strong>{tasksCount}</strong></p>
      
      {tasks.map((item, index) => (
        <TodoItem 
          key={index}
          item={item}
          index={index}
          onCheck={handleCheckTask}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          timerActive={isTimerActive}
          timerCompleted={timerCompleted} // Pass the timer completed state
        />
      ))}
    </div>
  );
}
