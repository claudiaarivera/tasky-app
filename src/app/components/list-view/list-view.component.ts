import { Component, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { TaskListItemComponent } from '../task-list-item/task-list-item.component';
import { TaskManagerService } from '../../services/task-manager.service';
import { Dialog } from '@angular/cdk/dialog';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { Section, Task } from '../../interfaces';
import { SectionItemComponent } from '../section-item/section-item.component';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-list-view',
  standalone: true,
  imports: [
    LucideAngularModule,
    TaskListItemComponent,
    CdkDrag,
    CdkDragHandle,
    CdkDropList,
    SectionItemComponent,
  ],
  host: {
    class: 'w-full'
  },
  templateUrl: './list-view.component.html',
})
export class ListViewComponent {
  private taskManagerService = inject(TaskManagerService);
  private toastService = inject(HotToastService);
  private dialog = inject(Dialog);
  public sections = this.taskManagerService.sections;
  public isSectionEditModeActivate = signal(false);
  openTaskDialig(dialogData: { section?: string; task?: Task }) {
    const { section, task } = dialogData;
    if (!section && !task) {
      return;
    }
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '450px',
      height: 'calc(100% - 40px)',
      data: { section, task },
    });
  }
  updateSectionName(sectionId: string, name: string) {
    this.taskManagerService
      .updateSectionName(name, sectionId)
      .pipe(
        this.toastService.observe({
          error: (e: any) => `The section name couldn't be updated.`,
        })
      )
      .subscribe();
  }
  toggleSubtaskCompletion(task: Task, completed: boolean) {
    const { id, section } = task;
    this.taskManagerService
      .updateSectionTask({ completed, id, section })
      .pipe(
        this.toastService.observe({
          error: (e: any) => `${e.error}`,
        })
      )
      .subscribe();
  }
  deleteTask(task: Task) {
    const { id, section } = task;
    this.taskManagerService
      .deleteSectionTask(id, section)
      .pipe(
        this.toastService.observe({
          loading: 'Deleting...',
          success: {
            content: (task) => {
              return `Your task was deleted.`;
            },
          },
          error: (e: any) => `${e.error}`,
        })
      )
      .subscribe();
  }
  deleteSection(section: string) {
    this.taskManagerService
      .deleteSection(section)
      .pipe(
        this.toastService.observe({
          loading: 'Deleting...',
          success: {
            content: (section) => {
              return `<b>${section.name}</b> section was deleted.`;
            },
          },
          error: (e: any) => `${e.error}`,
        })
      )
      .subscribe();
  }
  moveTask(event: CdkDragDrop<Section>) {
    const { container, previousIndex, currentIndex } = event;
    if (previousIndex === currentIndex) {
      return;
    }
    this.taskManagerService.reorderTasks(
      container.data,
      previousIndex,
      currentIndex
    );
  }
}
