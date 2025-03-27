import { useState, useEffect, useRef, useMemo } from "react";

export default function App() {
  interface Task {
    text: string;
    done: boolean;
  }

  const inputRef = useRef<HTMLInputElement>(null);
  const firstRender = useRef(true);
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editTask, setEditTask] = useState({
    enabled: false,
    task: "",
  });

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
    return `${tasks.length} ${tasks.length === 1 ? "To-do..." : "To-dos..."}`;
  }, [tasks]);

  function handleCheckTask(index: number) {
    setTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, done: !task.done } : task
      )
    );
  }

  function handleAddTask() {
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
    inputRef.current?.focus();
    setInput(item.text);
    setEditTask({
      enabled: true,
      task: item.text,
    });
  }

  function handleSaveEdit() {
    const editedTasks = tasks.map((task) =>
      task.text === editTask.task ? { ...task, text: input } : task
    );
    setTasks(editedTasks);
    setInput("");
    setEditTask({ enabled: false, task: "" });
  }

  function handleDeleteTask(item: string) {
    const newTasks = tasks.filter((task) => task.text !== item);
    setTasks(newTasks);
  }

  return (
    <>
      <h2>To-do fast</h2>
      <input
        ref={inputRef}
        value={input}
        placeholder="Add a To-do..."
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleAddTask}>{editTask.enabled ? "To-edit" : "To-add"}</button>
      <hr />
      <strong>{tasksCount}</strong>
      <br /><br />
      {tasks.map((item, index) => (
        <section key={index}>
          <input
            type="checkbox"
            checked={item.done}
            onChange={() => handleCheckTask(index)}
          />
          <span style={{ textDecoration: item.done ? "line-through" : "none" }}>
            {item.text}
          </span>
          <button onClick={() => handleEditTask(item)}>Edit</button>
          <button onClick={() => handleDeleteTask(item.text)}>Delete</button>
        </section>
      ))}
    </>
  );
}