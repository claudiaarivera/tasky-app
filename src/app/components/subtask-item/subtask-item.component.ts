import { Component, effect, ElementRef, EventEmitter, HostListener, input, Input, OnChanges, Output, signal, SimpleChanges, ViewChild } from '@angular/core';
import { SubTask } from '../../interfaces';
import { NgClass } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-subtask-item',
  standalone: true,
  imports: [NgClass, LucideAngularModule, ReactiveFormsModule],
  templateUrl: './subtask-item.component.html',
})
export class SubtaskItemComponent{
  public subtask = input<SubTask>();
  public id = input<number>();
  @Input() set editModeActiveInitialValue(value: boolean) {
    this.editModeIsActive.set(value);
  }
  @Output() onDeleteSubtask = new EventEmitter();
  @Output() onSubtaskDescriptionChanged = new EventEmitter<string>();
  @Output() onTaskCompletionChanged = new EventEmitter<boolean>();
  @Output() onEditModeActiveChanged = new EventEmitter<boolean>();
  @ViewChild('subtaskInput', { static: false}) 
  set input(element: ElementRef<HTMLInputElement>){ 
    if (element) element.nativeElement.focus();
  }
  public editModeIsActive = signal<boolean>(false);

  public control = new FormControl('', { nonNullable: true, validators: [Validators.required]});
  constructor(private elementRef: ElementRef){
    effect(() => {
      this.onEditModeActiveChanged.emit(this.editModeIsActive());
      if (this.subtask()) {
        this.control.setValue(this.subtask()!.description);
      }
    });
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.editModeIsActive.set(false);
    }
  }
  changeTaskCompletionCheckbox(e: Event){
    const completed = (e.target as HTMLInputElement).checked;
    this.onTaskCompletionChanged.emit(completed);
  }
  updateSubtaskDescription(){
    if (!this.control.valid) return;
    this.onSubtaskDescriptionChanged.emit(this.control.value);
    this.editModeIsActive.set(false);
  }
}
