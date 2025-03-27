import { useState, useEffect, useRef, useMemo } from "react";
import { Task } from "../../types";
import TodoItem from "./TodoItem";
import Timer from "../Timer/Timer";
import { CiSquarePlus, CiSaveDown1 } from "react-icons/ci";
import { useTimer } from "../../context/TimerContext";
import "./TodoList.css";

export default function TodoList() {
  const inputRef = useRef<HTMLInputElement>(null);
  const firstRender = useRef(true);
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editTask, setEditTask] = useState({
    enabled: false,
    task: "",
  });
  
  // Replace local timer state with context
  const { isTimerActive, setTimerActive } = useTimer();

  useEffect(() => {
    if (firstRender.current) {
      const cachedTasks = localStorage.getItem("app_cachedTasks");
      if (cachedTasks) setTasks(JSON.parse(cachedTasks));
      firstRender.current = false;
      return;
    }
    localStorage.setItem("app_cachedTasks", JSON.stringify(tasks));
  }, [tasks]);

  const tasksCount = useMemo(() => {
    return `${!tasks.length ? "no ToDorious available..." : ""}`;
  }, [tasks]);

  // Update timer handlers to use context
  const handleTimerStart = () => {
    setTimerActive(true);
  };

  const handleTimerEnd = () => {
    setTimerActive(false);
    alert("Time's up! How many ToDorious did you complete?");
  };

  function handleCheckTask(index: number) {
    setTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, done: !task.done } : task
      )
    );
  }

  function handleAddTask() {
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
  }

  function handleEditTask(item: Task) {
    if (isTimerActive) return; // Disable when timer is active
    
    inputRef.current?.focus();
    setInput(item.text);
    setEditTask({
      enabled: true,
      task: item.text,
    });
  }

  function handleSaveEdit() {
    if (isTimerActive) return; // Disable when timer is active
    
    const editedTasks = tasks.map((task) =>
      task.text === editTask.task ? { ...task, text: input } : task
    );
    setTasks(editedTasks);
    setInput("");
    setEditTask({ enabled: false, task: "" });
  }

  function handleDeleteTask(item: string) {
    if (isTimerActive) return; // Disable when timer is active
    
    const newTasks = tasks.filter((task) => task.text !== item);
    setTasks(newTasks);
  }

  return (
    <div className="todo-container">
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
            <span className="button-text">
              {editTask.enabled ? "Save" : "Add"}
            </span>
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
        />
      ))}
    </div>
  );
}
