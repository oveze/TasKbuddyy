import { useState, useEffect } from "react";
import { db } from "./Firebase";
import { collection, onSnapshot, deleteDoc, doc, updateDoc, QueryDocumentSnapshot } from "firebase/firestore";
import TaskModal from "./TaskModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FaTrashAlt } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { MdViewList } from "react-icons/md";
import { CiViewBoard } from "react-icons/ci";
import './Task.css';

interface Task {
  id: string;
  title: string;
  status: "TO-DO" | "IN-PROGRESS" | "COMPLETED";
  dueDate: string;
  category: string;
  fileUrl?: string;
}

interface TaskListProps {}

const TaskList: React.FC<TaskListProps> = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showTodo, setShowTodo] = useState<boolean>(true);
  const [showInProgress, setShowInProgress] = useState<boolean>(true);
  const [showDownload, setShowDownload] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDueDate, setSelectedDueDate] = useState<string>("");
  const [viewMode, setViewMode] = useState<"list" | "board">("list");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const taskList: Task[] = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
        id: doc.id,
        ...doc.data(),
      } as Task));
      setTasks(taskList);
    });

    return () => unsubscribe();
  }, []);

  const updateTaskStatus = async (taskId: string, newStatus: "TO-DO" | "IN-PROGRESS" | "COMPLETED") => {
    await updateDoc(doc(db, "tasks", taskId), { status: newStatus });
  };

  const categories = [...new Set(tasks.map((task) => task.category))];
  const dueDates = [...new Set(tasks.map((task) => task.dueDate))];

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery) &&
      (selectedCategory === "" || task.category === selectedCategory) &&
      (selectedDueDate === "" || task.dueDate === selectedDueDate)
  );

  const renderListView = () => (
    <div>
      <div className="toggl">
        <div className="tog" onClick={() => setShowTodo(!showTodo)}>
          <span>TO-DO ({filteredTasks.filter((task) => task.status === "TO-DO").length})</span>
          <span className={`arrow ${showTodo ? "open" : ""}`}>{showTodo ? "▲" : "▼"}</span>
        </div>
        {showTodo && (
          <div className="Task2">
            <button
              className="add-task-btn"
              onClick={() => {
                setEditingTask(null);
                setShowModal(true);
              }}
            >
              + Add Task
            </button>
            {filteredTasks
              .filter((task) => task.status === "TO-DO")
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  updateTaskStatus={updateTaskStatus}
                  setEditingTask={setEditingTask}
                  setShowModal={setShowModal}
                  viewMode="list"
                />
              ))}
          </div>
        )}
      </div>

      <div className="togglP">
        <div className="togP" onClick={() => setShowInProgress(!showInProgress)}>
          <span>IN-PROGRESS ({filteredTasks.filter((task) => task.status === "IN-PROGRESS").length})</span>
          <span className={`arrow ${showInProgress ? "open" : ""}`}>{showInProgress ? "▲" : "▼"}</span>
        </div>
        {showInProgress && (
          <div>
            {filteredTasks
              .filter((task) => task.status === "IN-PROGRESS")
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  updateTaskStatus={updateTaskStatus}
                  setEditingTask={setEditingTask}
                  setShowModal={setShowModal}
                  viewMode="list"
                />
              ))}
          </div>
        )}
      </div>

      <div className="togglC">
        <div className="togC" onClick={() => setShowDownload(!showDownload)}>
          <span>COMPLETED ({filteredTasks.filter((task) => task.status === "COMPLETED").length})</span>
          <span className={`arrow ${showDownload ? "open" : ""}`}>{showDownload ? "▲" : "▼"}</span>
        </div>
        {showDownload && (
          <div>
            {filteredTasks
              .filter((task) => task.status === "COMPLETED")
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  updateTaskStatus={updateTaskStatus}
                  setEditingTask={setEditingTask}
                  setShowModal={setShowModal}
                  viewMode="list"
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderBoardView = () => (
    <div className="board-container">
      <div className="board-column">
        <h3 className="h3">TO-DO ({filteredTasks.filter((task) => task.status === "TO-DO").length})</h3>
        {filteredTasks
          .filter((task) => task.status === "TO-DO")
          .map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              updateTaskStatus={updateTaskStatus}
              setEditingTask={setEditingTask}
              setShowModal={setShowModal}
              viewMode="board"
            />
          ))}
      </div>

      <div className="board-column">
        <h3 className="h4">IN-PROGRESS ({filteredTasks.filter((task) => task.status === "IN-PROGRESS").length})</h3>
        {filteredTasks
          .filter((task) => task.status === "IN-PROGRESS")
          .map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              updateTaskStatus={updateTaskStatus}
              setEditingTask={setEditingTask}
              setShowModal={setShowModal}
              viewMode="board"
            />
          ))}
      </div>

      <div className="board-column">
        <h3 className="h5">COMPLETED ({filteredTasks.filter((task) => task.status === "COMPLETED").length})</h3>
        {filteredTasks
          .filter((task) => task.status === "COMPLETED")
          .map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              updateTaskStatus={updateTaskStatus}
              setEditingTask={setEditingTask}
              setShowModal={setShowModal}
              viewMode="board"
            />
          ))}
      </div>
    </div>
  );

  return (
    <div>
      <button className="bttn" onClick={() => setViewMode("list")}>
        <MdViewList /> List view
      </button>
      <button className="bttn" onClick={() => setViewMode("board")}>
        <CiViewBoard /> Board view
      </button>

      <div className="search-container">
        <h2>Filter By:</h2>
        <select
          className="filter-dropdown"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {viewMode === "list" && (
          <select
            className="filter-dropdown"
            value={selectedDueDate}
            onChange={(e) => setSelectedDueDate(e.target.value)}
          >
            <option value="">All Due Dates</option>
            {dueDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="filters-container">
        <div className="Btn">
          <CiSearch style={{ color: "black" }} />
          <input
            className="in"
            type="text"
            placeholder="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          />
        </div>

        <button className="btn" onClick={() => { setEditingTask(null); setShowModal(true); }}>
          + Add Task
        </button>
      </div>

      {viewMode === "list" ? renderListView() : renderBoardView()}

      {showTodo && (
        <TaskModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          task={editingTask || undefined} // Ensure undefined if task is null
        />
      )}
    </div>
  );
};

interface TaskCardProps {
  task: Task;
  updateTaskStatus: (taskId: string, status: "TO-DO" | "IN-PROGRESS" | "COMPLETED") => void;
  setEditingTask: React.Dispatch<React.SetStateAction<Task | null>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  viewMode: "list" | "board";
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  updateTaskStatus,
  setEditingTask,
  setShowModal,
  viewMode,
}) => {
  return (
    <div className={`task-card ${viewMode}`}>
      <div className="task-content">
        <p>{task.title}</p>
        <p>Due Date: {task.dueDate}</p>
        <p>Category: {task.category}</p>
        <p>Status: {task.status}</p>
      </div>
      <div className="task-actions">
        <button
          onClick={() => {
            setEditingTask(task);
            setShowModal(true);
          }}
        >
          <FontAwesomeIcon icon={faPen} />
        </button>
        <button onClick={() => deleteDoc(doc(db, "tasks", task.id))}>
          <FaTrashAlt />
        </button>
      </div>
    </div>
  );
};

export default TaskList;
