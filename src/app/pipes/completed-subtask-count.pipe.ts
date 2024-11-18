import { Pipe, PipeTransform } from '@angular/core';
import { SubTask, Task } from '../interfaces';

@Pipe({
  name: 'completedSubtaskCount',
  standalone: true
})
export class CompletedSubtaskCountPipe implements PipeTransform {

   transform(task: Pick<Task, 'subtasks'>): number{
    if (!task.subtasks) return 0;
    const completed = task.subtasks?.reduce((acc, current) => {
      if (current.completed) acc++;
      return acc;
    }, 0)
    return completed;
  }

}
