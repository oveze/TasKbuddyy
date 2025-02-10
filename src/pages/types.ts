export interface Task {
  id: string;
  title: string;
  category: string;
  dueDate: Date; // Use Date instead of string for better handling
}

export interface TaskModalProps {
  task?: Task | null;
  onClose: () => void;
  onSave: (task: Task) => void;
}
