import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewTypesComponent } from '../../components/view-types/view-types.component';
import { BoardViewComponent } from '../../components/board-view/board-view.component';
import { TaskManagerService } from '../../services/task-manager.service';
import { ListViewComponent } from '../../components/list-view/list-view.component';
@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    ViewTypesComponent,
    BoardViewComponent,
    ListViewComponent
  ],
  templateUrl: './workspace.component.html',
})
export class WorkspaceComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private taskManagerService = inject(TaskManagerService);
  public activeViewType = this.taskManagerService.activeViewType;
  ngOnInit(): void {
    this.route.queryParams.subscribe(({ view }) => {});
  }
}
