import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, LucideIconConfig } from 'lucide-angular';
import { DropdownComponent } from './components/dropdown/dropdown.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, DropdownComponent, LucideAngularModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private lucideIconConfig = inject(LucideIconConfig);
 
  constructor(){
    this.lucideIconConfig.strokeWidth = 1.75;
  }
}
