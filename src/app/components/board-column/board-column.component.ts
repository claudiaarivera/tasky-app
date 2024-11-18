import { Component, ContentChild, EventEmitter, Input,OnChanges,Output,SimpleChanges,TemplateRef } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { SectionNameComponent } from '../section-name/section-name.component';
import { Section } from '../../interfaces';

@Component({
  selector: 'app-board-column',
  standalone: true,
  imports: [
    SectionNameComponent,
    LucideAngularModule,
    CommonModule,
    NgTemplateOutlet,
  ],
  host: {
    class: 'flex overflow-hidden flex-col'
  },
  templateUrl: './board-column.component.html',
})
export class BoardColumnComponent{
  @ContentChild('dragHandle') dragHandleTemplate!: TemplateRef<any>;
  @Input({required: true}) section!: Section;
  @Output() onAddTask = new EventEmitter<void>();
  @Output() onDeleteSection = new EventEmitter<void>();
  @Output() onSectionNameChanged = new EventEmitter<string>();
  get taskLength(){
    return this.section.tasks.length;
  }
  updateSectionName(name: string) {
    this.onSectionNameChanged.emit(name);
  }
}
