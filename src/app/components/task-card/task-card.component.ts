import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Task } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { TaskManagerService } from '../../services/task-manager.service';
import { CompletedSubtaskCountPipe } from '../../pipes/completed-subtask-count.pipe';
import { PriorityBadgeComponent } from '../priority-badge/priority-badge.component';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [
    LucideAngularModule,
    CommonModule,
    DropdownComponent,
    CompletedSubtaskCountPipe,
    PriorityBadgeComponent
  ],
  templateUrl: './task-card.component.html',
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Output() onEditTask = new EventEmitter<void>();
  @Output() onDeleteTask = new EventEmitter<void>();
  @Output() onTaskCompletionChanged = new EventEmitter<boolean>();
  public items: any[] = [
    {
      label: 'Edit',
      icon: 'pencil',
      onClick: (i: number) => {
        this.onEditTask.emit();
      },
    },
    {
      label: 'Delete',
      icon: 'trash',
      id: 'delete',
      onClick: (i: number) => {
        this.onDeleteTask.emit();
      },
    },
  ];
  changeTaskCompletionCheckbox(e: Event){
    const completed = (e.target as HTMLInputElement).checked;
    this.onTaskCompletionChanged.emit(completed);
  }
}
