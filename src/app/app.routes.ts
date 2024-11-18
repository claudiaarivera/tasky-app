import { Routes } from '@angular/router';
import { WorkspaceComponent } from './pages/workspace/workspace.component';

export const routes: Routes = [
  {
    path: 'workspace',
    component: WorkspaceComponent,
  },
  {
    path: '**',
    redirectTo: '/workspace',
  },
];
