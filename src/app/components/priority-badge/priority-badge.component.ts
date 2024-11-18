import { Component, Input } from '@angular/core';
import { Priority } from '../../interfaces';
import { priorityClasses } from '../../helpers/priority.helper';
import { NgClass, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-priority-badge',
  standalone: true,
  imports: [NgClass, TitleCasePipe],
  templateUrl: './priority-badge.component.html',
})
export class PriorityBadgeComponent {
  @Input({required: true}) priority!: Priority;
  public priorityClasses = priorityClasses();

}
