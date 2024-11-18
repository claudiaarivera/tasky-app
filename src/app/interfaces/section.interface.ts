import { Task } from "./task.interface";

export interface Section {
  id: string;
  name: string;
  tasks: Task[];
}