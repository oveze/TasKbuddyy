import { useState, ChangeEvent, FormEvent } from "react";
import Modal from "react-modal";
import { db, storage } from "./Firebase";
import { collection, addDoc, updateDoc, doc, DocumentData } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

Modal.setAppElement("#root");

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: DocumentData;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task }) => {
  const [title, setTitle] = useState<string>(task ? task.title : "");
  const [description, setDescription] = useState<string>(task ? task.description : "");
  const [category, setCategory] = useState<string>(task ? task.category : "Work");
  const [dueDate, setDueDate] = useState<Date | null>(task ? new Date(task.dueDate) : null);

  const [status, setStatus] = useState<string>(task ? task.status : "TO-DO");
  const [fileUrl, setFileUrl] = useState<string>(task ? task.fileUrl : "");
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setUploading(true);
    const storageRef = ref(storage, `taskFiles/${uploadedFile.name}`);

    try {
      await uploadBytes(storageRef, uploadedFile);
      const downloadURL = await getDownloadURL(storageRef);
      setFileUrl(downloadURL);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    const taskData = {
      title,
      description,
      category,
      dueDate: dueDate ? dueDate.toISOString().split("T")[0] : "",
      status,
      fileUrl,
    };

    if (task) {
      await updateDoc(doc(db, "tasks", task.id), taskData);
    } else {
      await addDoc(collection(db, "tasks"), taskData);
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="modal">
      <h2>{task ? "Edit Task" : "Add New Task"}</h2>

      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task Description"
        required
      />

      <div>
        <button className={category === "Work" ? "selected" : ""} onClick={() => setCategory("Work")}>Work</button>
        <button className={category === "Personal" ? "selected" : ""} onClick={() => setCategory("Personal")}>Personal</button>
      </div>

      <DatePicker selected={dueDate} onChange={(date: Date | null) => setDueDate(date)} />

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="TO-DO">TO-DO</option>
        <option value="IN-PROGRESS">IN-PROGRESS</option>
        <option value="COMPLETED">COMPLETED</option>
      </select>

      <input type="file" onChange={handleFileUpload} />
      {uploading && <p>Uploading...</p>}
      {fileUrl && (
        <p>
          File uploaded: <a href={fileUrl} target="_blank" rel="noopener noreferrer">View File</a>
        </p>
      )}

      <div className="modal-actions">
        <button onClick={onClose}>Cancel</button>
        <button onClick={handleSubmit}>{task ? "Update" : "Add"} Task</button>
      </div>
    </Modal>
  );
};

export default TaskModal;
