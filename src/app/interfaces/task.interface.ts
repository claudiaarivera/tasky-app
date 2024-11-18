import { Priority } from './priority.interface';
import { SubTask } from "./sub-task.interface";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority | null;
  createdAt: string;
  updatedAt: string;
  completed: boolean;
  dueDate?: string;
  tags?: string[];  
  subtasks?: SubTask[];
  section: string;
}