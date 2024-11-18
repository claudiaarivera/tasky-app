import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  JsonPipe,
  NgClass,
  NgTemplateOutlet,
  TitleCasePipe,
} from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { TaskManagerService } from '../../services/task-manager.service';
import {
  NgLabelTemplateDirective,
  NgOptionComponent,
  NgOptionTemplateDirective,
  NgSelectComponent,
} from '@ng-select/ng-select';
import { priorityClasses } from '../../helpers/priority.helper';
import { Priority, SubTask, Task, UpdateTask } from '../../interfaces';
import { PercentageFromTotalPipe } from '../../pipes/percentage-from-total.pipe';
import { CompletedSubtaskCountPipe } from '../../pipes/completed-subtask-count.pipe';
import { TaskProgressBarComponent } from '../task-progress-bar/task-progress-bar.component';
import { SubtaskItemComponent } from '../subtask-item/subtask-item.component';
import { finalize } from 'rxjs';
import { HotToastService } from '@ngxpert/hot-toast';

interface SubtaskFormGroup
  extends FormGroup<{
    description: FormControl<string>;
    completed: FormControl<boolean>;
  }> {}
@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    TaskProgressBarComponent,
    SubtaskItemComponent,
    LucideAngularModule,
    ReactiveFormsModule,
    NgClass,
    NgSelectComponent,
    PercentageFromTotalPipe,
    CompletedSubtaskCountPipe,
    TitleCasePipe,
    NgLabelTemplateDirective,
    NgOptionTemplateDirective,
    NgTemplateOutlet,
  ],
  host: {
    class:
      'bg-white rounded-lg shadow-lg border flex flex-col max-h-full overflow-hidden',
  },
  templateUrl: './task-dialog.component.html',
})
export class TaskDialogComponent {
  private taskManagerService = inject(TaskManagerService);
  private toastService = inject(HotToastService);
  public dialogRef = inject<DialogRef<string>>(DialogRef<string>);
  public data = inject<{ task?: Task; section: string }>(DIALOG_DATA, {
    optional: true,
  });
  private fb = inject(FormBuilder);
  public priorities = this.taskManagerService.priorities;
  public priorityClasses = priorityClasses();
  public isNewSubtaskControlActive = signal(false);
  public isSaving = signal(false);
  public taskForm = this.fb.group({
    id: this.fb.control(''),
    section: this.fb.nonNullable.control('', Validators.required),
    title: this.fb.nonNullable.control('', Validators.required),
    description: this.fb.nonNullable.control('', Validators.required),
    dueDate: this.fb.nonNullable.control(''),
    tags: this.fb.nonNullable.control<string[]>([]),
    priority: this.fb.control<Priority | null>(null, Validators.required),
    completed: this.fb.nonNullable.control(false, Validators.required),
    subtasks: this.fb.nonNullable.array<SubtaskFormGroup>([]),
  });
  constructor() {
    if (!this.data) return;
    const { section, task } = this.data;
    this.taskForm.patchValue({ section });
    if (!task) return;
    const { subtasks, ...resTask } = task;
    this.taskForm.patchValue({ ...resTask });
    if (!subtasks) return;
    subtasks.forEach((subtask) => {
      this.subtasks.push(this.getSubTaskControl(subtask));
    });
  }
  getPriorityClasses(priority: Priority) {
    return this.priorityClasses[priority.color];
  }
  getSubtask(control: SubtaskFormGroup) {
    return control.getRawValue();
  }
  getSubTaskControl(subtask: SubTask = { completed: false, description: '' }) {
    return this.fb.group({
      description: this.fb.nonNullable.control<string>(subtask.description),
      completed: this.fb.nonNullable.control(subtask.completed),
    });
  }
  get subtasks() {
    return this.taskForm.controls.subtasks;
  }
  get isTaskCompleted() {
    return this.taskForm.controls.completed.value;
  }
  get taskFormValue() {
    return { ...this.taskForm.getRawValue() };
  }
  toggleTaskCompletion() {
    this.taskForm.controls.completed.setValue(!this.isTaskCompleted);
  }
  addSubtask(description: string) {
    this.subtasks.push(
      this.getSubTaskControl({ description, completed: false })
    );
    this.isNewSubtaskControlActive.set(false);
  }
  toggleSubtaskCompletion(index: number, isCompleted: boolean) {
    this.subtasks.controls[index].controls.completed.setValue(isCompleted);
  }
  updateSubtaskDescription(index: number, newDescription: string) {
    this.subtasks.controls[index].controls.description.setValue(newDescription);
  }
  deleteSubtask(idx: number) {
    this.subtasks.removeAt(idx);
  }
  submitTaskForm() {
    if (!this.taskForm.valid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    this.isSaving.set(true);
    if (!this.taskFormValue.id) {
      this.addTask();
      return;
    }
    const id = this.taskFormValue.id;
    this.updateTask({ ...this.taskFormValue, id });
  }
  private updateTask(task: UpdateTask) {
    this.taskManagerService
      .updateSectionTask(task)
      .pipe(
        finalize(() => {
          this.isSaving.set(false);
          this.dialogRef.close();
        }),
        this.toastService.observe({
          loading: 'Saving...',
          success: 'Your task was updated.',
          error: (e: any) => `${e.error}`,
        })
      )
      .subscribe();
  }
  private addTask() {
    this.taskManagerService
      .addSectionTask(this.taskFormValue)
      .pipe(
        finalize(() => this.isSaving.set(false)),
        this.toastService.observe({
          loading: 'Saving...',
          success: 'Your task was added.',
          error: (e: any) => `${e.error}`,
        })
      )
      .subscribe();
    this.resetForm();
  }
  resetForm() {
    this.subtasks.clear();
    this.taskForm.reset();
    this.dialogRef.close();
  }
}
