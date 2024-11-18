import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priorityTask',
  standalone: true
})
export class PriorityTaskPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
