import { NgClass } from '@angular/common';
import { Component, ContentChild, EventEmitter, inject, Input, Output, TemplateRef } from '@angular/core';
import { Section } from '../../interfaces';
import { SectionNameComponent } from '../section-name/section-name.component';
import { TaskManagerService } from '../../services/task-manager.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-section-item',
  standalone: true,
  imports: [NgClass, SectionNameComponent, LucideAngularModule],
  templateUrl: './section-item.component.html',
})
export class SectionItemComponent {
  @Input({ required: true }) section!: Section;
  @ContentChild('dragHandle') dragHandleTemplate!: TemplateRef<any>;
  @Output() onAddTask = new EventEmitter<void>();
  @Output() onDeleteSection = new EventEmitter<void>();
  @Output() onSectionNameChanged = new EventEmitter<string>();
  private taskManagerService = inject(TaskManagerService);
  deleteSection(section: string) {
    this.taskManagerService.deleteSection(section);
  }
}
