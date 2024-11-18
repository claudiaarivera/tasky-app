import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../interfaces';

@Pipe({
  name: 'completedTaskCount',
  standalone: true
})
export class CompletedTaskCountPipe implements PipeTransform {
  transform(tasks: Task[]): number {
    return tasks.reduce((acc, current) => {
      if (current.completed) acc++;
      return acc;
    }, 0)
  }

}
