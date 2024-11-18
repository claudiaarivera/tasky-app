import { NgClass } from '@angular/common';
import { Component, computed, input, Input } from '@angular/core';

@Component({
  selector: 'app-task-progress-bar',
  standalone: true,
  imports: [NgClass],
  host: {
    class: 'w-full',
  },
  templateUrl: './task-progress-bar.component.html',
})
export class TaskProgressBarComponent {
  public value = input<number | string | null>(null);
  public valueFormated = computed(() => {
    const newValue = Number(this.value()); 
    return !isNaN(newValue) ? newValue: 0;
  })
  get progressBgClass(){
    const value = this.valueFormated();
    return {
      'bg-red-500':  value>=0 && value<=25,
      'bg-orange-500':  value>=26 && value<=50,
      'bg-yellow-500':  value>=51 && value<=75,
      'bg-green-500':  value>=76 && value<=100,
    }
  }
}
