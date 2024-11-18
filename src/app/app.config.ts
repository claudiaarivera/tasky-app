import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import {
  Calendar,
  CalendarDays,
  LucideAngularModule,
  Plus,
  Clock,
  GripHorizontal,
  CircleChevronDown,
  Archive,
  EllipsisVertical,
  Ellipsis,
  Pencil,
  Trash,
  Copy,
  X,
  Check,
  CircleCheck,
  Star,
  GripVertical,
  Workflow,
  PencilLine,
} from 'lucide-angular';
import { provideHttpClient } from '@angular/common/http';
import { provideHotToastConfig } from '@ngxpert/hot-toast';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    provideHotToastConfig({
      position: 'top-left',
      autoClose: true,
      dismissible: true,
      duration: 4000,
      reverseOrder: true,
      style: {
        '--hot-toast-border-radius': '6px',
      },
      className: 'text-sm border border-gray-100',
      success: {
        //style: { backgroundColor: '#ecffe9' },
      },
    }),
    importProvidersFrom(
      LucideAngularModule.pick({
        Plus,
        CalendarDays,
        Calendar,
        Clock,
        GripHorizontal,
        GripVertical,
        CircleChevronDown,
        Archive,
        EllipsisVertical,
        Ellipsis,
        Pencil,
        Trash,
        Copy,
        X,
        Check,
        CircleCheck,
        Star,
        Workflow,
        PencilLine,
      })
    ),
  ],
};
