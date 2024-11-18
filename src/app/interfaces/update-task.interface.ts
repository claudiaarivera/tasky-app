import { Task } from './task.interface';

export interface UpdateTask
  extends 
    Partial<Pick<Task,'title' | 'description' | 'completed' | 'dueDate' | 'tags' | 'subtasks' | 'priority'>>,
    Pick<Task, 'section' | 'id'> {
}
