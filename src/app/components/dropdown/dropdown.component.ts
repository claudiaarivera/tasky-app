import { CommonModule } from '@angular/common';
import { Component, ContentChild, ElementRef, Input, signal, TemplateRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

interface MenuItem {
  label: string;
  icon?: string;
  route?: string;
  styleClass?: string;
  id?: string;
  state: {[key: string]: string},
  onClick?(idx: number): void;
}
@Component({
  selector: 'app-dropdown',
  standalone: true,
  host: {
    class: 'dropdown',
  },
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './dropdown.component.html',
})
export class DropdownComponent {
  @ViewChild('menu') menuElement!: ElementRef;
  @Input() items?: MenuItem[] | null = null;
  @Input() id?: string;
  @ContentChild('dropdownItem') dropdownItemTemplate?: TemplateRef<any>;
  @ContentChild('dropdownToggle') dropdownToggleContent!: TemplateRef<any>;
  @Input() hasToggleIcon: boolean = false;

  public isDropdownOpen = signal(false);
  constructor(){
    
  }
  public toggle(){
    this.isDropdownOpen.update((isOpen) =>!isOpen);
  }
}
