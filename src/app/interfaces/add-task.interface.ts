import { Task } from './task.interface';

export interface AddTask
  extends Pick<
    Task,
    | 'title'
    | 'description'
    | 'completed'
    | 'dueDate'
    | 'tags'
    | 'subtasks'
    | 'section'
    | 'priority'
  > {
}
