import { useState } from "react";
import { db } from "./Firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";

interface Task {
  id?: string;
  title: string;
  category: string;
  dueDate: string;
}

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onClose }) => {
  const [title, setTitle] = useState<string>(task ? task.title : "");
  const [category, setCategory] = useState<string>(task ? task.category : "Work");
  const [dueDate, setDueDate] = useState<string>(task ? task.dueDate : "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (task) {
      // Update existing task
      await updateDoc(doc(db, "tasks", task.id!), {
        title,
        category,
        dueDate,
      });
    } else {
      // Add new task
      await addDoc(collection(db, "tasks"), {
        title,
        category,
        dueDate,
      });
    }

    onClose();
  };

  return (
    <div className="task-form">
      <h2>{task ? "Edit Task" : "Add New Task"}</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Task Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
        </select>

        <input 
          type="date" 
          value={dueDate} 
          onChange={(e) => setDueDate(e.target.value)}
          required
        />

        <button type="submit">{task ? "Update" : "Add"} Task</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default TaskForm;
