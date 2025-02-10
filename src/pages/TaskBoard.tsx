import { useState, useEffect } from "react";
import { db } from "./Firebase";
import { collection, updateDoc, doc, onSnapshot, DocumentData } from "firebase/firestore";

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  dueDate: string;
  status: string;
  fileUrl?: string;
}

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const taskCollectionRef = collection(db, "tasks");

  useEffect(() => {
    const unsubscribe = onSnapshot(taskCollectionRef, (snapshot) => {
      setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Task)));
    });

    return () => unsubscribe();
  }, []);

  const updateTaskStatus = async (taskId: string, newStatus: string): Promise<void> => {
    const taskDoc = doc(db, "tasks", taskId);
    await updateDoc(taskDoc, { status: newStatus });
  };

  return (
    <div className="task-board">
      {["TO-DO", "IN-PROGRESS", "COMPLETED"].map((status) => (
        <div key={status} className="task-column">
          {/* <h3>{status}</h3> */}
          {tasks.filter((task) => task.status === status).map((task) => (
            <div
              key={task.id}
              draggable
              onDragEnd={() => updateTaskStatus(task.id, status)}
            >
              {/* {task.title} */}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;
