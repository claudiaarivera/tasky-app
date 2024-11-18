import { Component, computed, ContentChild, EventEmitter, input, Output, TemplateRef } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Task } from '../../interfaces';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { PercentageFromTotalPipe } from '../../pipes/percentage-from-total.pipe';
import { CompletedSubtaskCountPipe } from '../../pipes/completed-subtask-count.pipe';
import { PriorityBadgeComponent } from '../priority-badge/priority-badge.component';
import { TaskProgressBarComponent } from '../task-progress-bar/task-progress-bar.component';

@Component({
  selector: 'app-task-list-item',
  standalone: true,
  imports: [
    LucideAngularModule,
    DatePipe,
    CompletedSubtaskCountPipe,
    PercentageFromTotalPipe,
    PriorityBadgeComponent,
    TaskProgressBarComponent,
    NgTemplateOutlet
  ],
  templateUrl: './task-list-item.component.html',
})
export class TaskListItemComponent {
  public task = input.required<Task>();
  @Output() onDeleteTask = new EventEmitter<void>();
  @Output() onTaskCompletionChanged = new EventEmitter<boolean>();
  @Output() onEditTask = new EventEmitter<void>();
  @ContentChild('dragHandle') dragHandleTemplate!: TemplateRef<any>;
  public subtasks = computed(() => this.task().subtasks);
  public tags = computed(() => this.task().tags);
  public tagsLength = computed(() => this.tags()?.length || 0);
  toggleSubtaskCompletion(e: Event) {
    const completed = (e.target as HTMLInputElement).checked;
    this.onTaskCompletionChanged.emit(completed);
  }
 
}
