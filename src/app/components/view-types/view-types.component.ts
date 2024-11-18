import { Component, inject } from '@angular/core';
import { TaskManagerService } from '../../services/task-manager.service';
import { ViewType } from '../../interfaces';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-view-types',
  standalone: true,
  imports: [NgClass],
  templateUrl: './view-types.component.html',
})
export class ViewTypesComponent {
  private taskManagerService = inject(TaskManagerService);
  public activeViewType = this.taskManagerService.activeViewType;
  setViewType(viewType: ViewType) {
    this.taskManagerService.setActiveViewType(viewType);
  }
}
