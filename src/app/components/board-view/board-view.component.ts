import {
  Component,
  inject,
  signal,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { BoardColumnComponent } from '../board-column/board-column.component';
import { LucideAngularModule } from 'lucide-angular';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskManagerService } from '../../services/task-manager.service';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from '../task-card/task-card.component';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { Section, Task } from '../../interfaces';
import { Dialog } from '@angular/cdk/dialog';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-board-view',
  standalone: true,
  host: {
    class: 'flex'
  },
  imports: [
    BoardColumnComponent,
    TaskCardComponent,
    LucideAngularModule,
    ReactiveFormsModule,
    CommonModule,
    CdkDrag,
    CdkDropListGroup,
    CdkDropList,
    CdkDragHandle,
  ],
  styles: `
   
  `,
  templateUrl: './board-view.component.html',
})
export class BoardViewComponent implements OnInit {
  @ViewChild('newSectionControl', { static: false })
  set control(element: ElementRef<HTMLInputElement>) {
    if (element) element.nativeElement.focus();
  }
  private fb = inject(FormBuilder);
  private taskManagerService = inject(TaskManagerService);
  private toastService = inject(HotToastService);

  private dialog = inject(Dialog);
  public sections = this.taskManagerService.sections;
  public isAddSectionModeActive = signal(false);
  public sectionFormControl = this.fb.nonNullable.control('', [
    Validators.required,
  ]);
  public isEditModeActive = signal(false);
  ngOnInit(): void {}
  showSectionForm() {
    this.setSectionModeStatus(true);
  }
  get sectionNameValue() {
    return this.sectionFormControl.value.trim();
  }
  moveSection(event: CdkDragDrop<Section>) {
    const { previousIndex, currentIndex } = event;
    if (previousIndex === currentIndex) return;
    this.taskManagerService.reorderSections(previousIndex, currentIndex);
  }
  moveTask(event: CdkDragDrop<Section>) {
    const { previousContainer, container, previousIndex, currentIndex } = event;
    const isSameContainer = previousContainer === container;
    if (isSameContainer && previousIndex === currentIndex) {
      return;
    }
    isSameContainer
      ? this.taskManagerService.reorderTasks(
          container.data,
          previousIndex,
          currentIndex
        )
      : this.taskManagerService.transferTask({
          fromSection: previousContainer.data,
          fromTaskIndex: previousIndex,
          toSection: container.data,
          toTaskIndex: currentIndex,
        });
  }
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

  deleteSection(sectionId: string) {
    this.taskManagerService
      .deleteSection(sectionId)
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
  addSection() {
    if (this.sectionFormControl.valid) {
      this.taskManagerService
        .addSection(this.sectionNameValue)
        .pipe(
          this.toastService.observe({
            error: (e: any) => `The section couldn't be added.`,
          })
        )
        .subscribe();
    }
    this.sectionFormControl.reset();
    this.setSectionModeStatus(false);
  }
  setSectionModeStatus(value: boolean) {
    this.isAddSectionModeActive.set(value);
  }
}
