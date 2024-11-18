import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-section-name',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LucideAngularModule],
  templateUrl: './section-name.component.html',
})
export class SectionNameComponent {
  @Input({ required: true }) set value(value: string) {
    this.sectionNameControl.setValue(value);
  }
  @Input() showToggleIcon: boolean = false;
  @Output() onNameChanged = new EventEmitter<string>();
  @ViewChild('sectionControl', { static: false }) 
  set control(element: ElementRef<HTMLInputElement>) {
    if (element) element.nativeElement.focus();
  }
  private fb = inject(FormBuilder);
  public isEditModeActive = signal(false);
  public sectionNameControl = this.fb.nonNullable.control('');
  constructor(private elementRef: ElementRef){

  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isEditModeActive.set(false);
    }
  }
  get sectionNameValue() {
    return this.sectionNameControl.value;
  }
  emitValue() {
    this.sectionNameControl.valid && this.onNameChanged.emit(this.sectionNameValue);
  }
  activeEditMode() {
    this.isEditModeActive.set(true);
  }
  emitValueAndDesactiveEditMode(){
    this.emitValue();
    this.isEditModeActive.set(false);
  }
}
