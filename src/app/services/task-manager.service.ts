import {
  computed,
  effect,
  inject,
  Injectable,
  LOCALE_ID,
  signal,
} from '@angular/core';
import { v4 as uuid } from 'uuid';
import {
  AddTask,
  Priority,
  Section,
  Task,
  TransferTaskData,
  ViewType,
} from '../interfaces';
import { toSignal } from '@angular/core/rxjs-interop';
import { formatDate } from '@angular/common';
import { catchError, Observable, of } from 'rxjs';
import { isValidDate } from '../utils/date.utils';
import { HttpClient } from '@angular/common/http';
import { UpdateTask } from '../interfaces/update-task.interface';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { SECTIONS } from '../mock/sections.mock';

@Injectable({
  providedIn: 'root',
})
export class TaskManagerService {
  private _sections = signal<Section[]>(this.getStagesFromLocalStorage());
  private _http = inject(HttpClient);
  private _isAddSectionModeActive = signal(false);
  private _priorities = toSignal(this.getPriorities(), { initialValue: [] });
  private _activeViewType = signal<ViewType>('board');
  public sections = computed(() => this._sections());
  public priorities = computed(() => this._priorities());
  public activeViewType = computed(() => this._activeViewType());

  public isAddSectionModeActive = computed(() =>
    this._isAddSectionModeActive()
  );
  private localID = inject(LOCALE_ID);

  constructor() {
    this.getPriorities();
    effect(() => {
      if (this._sections()) {
        this.saveSectionsInLocalStorage();
      }
    })
  }
  getPriorities(): Observable<Priority[]> {
    return this._http
      .get<Priority[]>(`data/priorities.json`)
      .pipe(catchError(() => of([])));
  }
  setActiveViewType(view: ViewType) {
    this._activeViewType.set(view);
  }
  deleteSection(sectionId: string): Observable<Section>{
    return new Observable<Section>((observer) => {
       try {
         setTimeout(() => {
           const sectionIndex = this._sections().findIndex(
             (section) => section.id === sectionId
           );
           if (sectionIndex === -1) {
             return observer.error({ error: `Section doesn't exist.`});
           }
           this._sections.update((sections) => {
            const sectionsUpdated = [...sections];
            const deletedSection = sectionsUpdated.splice(sectionIndex, 1);
            observer.next(deletedSection[0]);
            return sectionsUpdated;
           });
           observer.complete();
         }, 1200) 
 
       } catch (error) {
         observer.error({ error: 'Unexpected error'});
       }
     })
  }
  updateSectionName(name: string, sectionId: string): Observable<Section> {
    return new Observable<Section>((observer) => {
      try {
        setTimeout(() => {
          const sectionIndex = this._sections().findIndex(
            (section) => section.id === sectionId
          );
          if (sectionIndex === -1) {
            return observer.error({ error: `Section doesn't exist.`});
          }
          this._sections.update((sections) => {
            const sectionsUpdated = [...sections];
            sectionsUpdated[sectionIndex] =  {
              ...sectionsUpdated[sectionIndex],
              name
            };
            observer.next(sectionsUpdated[sectionIndex]);
            return sectionsUpdated;
          });
          observer.complete();
        }, 1200);
      } catch (error) {
        observer.error({ error: 'Unexpected error'});
      }
    });
    
  }
  addSection(sectionName: string): Observable<Section> {
    return new Observable<Section>((observer) => {
      try {
        const newSection: Section = {
          name: sectionName,
          id: uuid(),
          tasks: [],
        };
        setTimeout(() => {
          observer.next(newSection);
          this._sections.update((stages) => [...stages, newSection]);
          observer.complete();
        }, 500)
      } catch (error) {
        observer.error({ error: 'Unexpected error'});
      }
    });
    
  }
  updateSectionTask(task: UpdateTask):Observable<Task> {
    return new Observable<Task>((observer) => {
      try {
        setTimeout(() => {
          const {id: taskId, section: sectionId} = task;
          const sectionIndex = this._sections().findIndex(
            (section) => section.id === sectionId
          );
          if (sectionIndex === -1) {
            observer.error(`Section doesn't exist`);
          }
          const taskIndex = this._sections()[sectionIndex].tasks.findIndex(
            (task) => task.id === taskId
          );
          if (taskIndex === -1) {
            observer.error(`Task doesn't exist`);
          }
          this._sections.update((sections) => {
            const sectionsUpdated = [...sections];
            const prevTask = sectionsUpdated[sectionIndex].tasks[taskIndex];
            sectionsUpdated[sectionIndex].tasks[taskIndex] = {
              ...prevTask,
              ...task,
            };
            observer.next(sectionsUpdated[sectionIndex].tasks[taskIndex]);
            observer.complete();
            return sectionsUpdated;
          });
        }, 500);
      } catch (error) {
        observer.error({ error: 'Unexpected error'});
      }
      
    });
  }
  deleteSectionTask(taskId: string, sectionId: string): Observable<Task> {
    return new Observable<Task>((observer) => {
      try {
        const sectionIndex = this._sections().findIndex(
          (section) => section.id === sectionId
        );
        if (sectionIndex === -1) {
          observer.error(`Section doesn't exist`);
        }
        const taskIndex = this._sections()[sectionIndex].tasks.findIndex(
          (task) => task.id === taskId
        );
        if (taskIndex === -1) {
          observer.error(`Task doesn't exist`);
        }
        this._sections.update((sections) => {
          const sectionsUpdated = [...sections];
          observer.next(sections[sectionIndex].tasks[taskIndex]);
          observer.complete();
          sectionsUpdated[sectionIndex].tasks.splice(taskIndex, 1);
          return sectionsUpdated;
        });
      } catch (error) {
        observer.error({ error: 'Unexpected error'});
      }
    });
    
  }
  addSectionTask(task: AddTask): Observable<Task> {
    return new Observable<Task>((observer) => {
      const { dueDate, ...resTask } = task;
      if (dueDate && !isValidDate(dueDate)) observer.error(`Invalid dueDate`);
      try {
        const newTask = {
          ...resTask,
          id: uuid(),
          ...(dueDate && {
            dueDate: formatDate(dueDate, 'yyyy-MM-dd', this.localID),
          }),
          createdAt: formatDate(new Date(), 'yyyy-MM-dd', this.localID),
          updatedAt: formatDate(new Date(), 'yyyy-MM-dd', this.localID),
        };
        this._sections.update((sections) => {
          return sections.map((section) => ({
            ...section,
            ...(section.id === task.section && {
              tasks: [...section.tasks, newTask],
            }),
          }));
        });
        observer.next(newTask);
        observer.complete();
      } catch (error) {
        observer.error({ error: 'Unexpected error'});
      }
    });
  
  }
  reorderSections(fromIndex: number, toIndex: number){
    this._sections.update((sections) => {
      moveItemInArray(sections,fromIndex,toIndex);
      return [...sections];
    });
  }
  reorderTasks({ id }: Section, fromIndex: number, toIndex: number) {
    this._sections.update((sections) => {
      const sectionIndex = sections.findIndex((section) => section.id === id);
      const tasks = [...sections[sectionIndex].tasks];
      moveItemInArray(tasks, fromIndex, toIndex);
      sections[sectionIndex].tasks = tasks;
      return [...sections];
    });
  }
  transferTask(transferData: TransferTaskData) {
    const { fromSection, fromTaskIndex, toSection, toTaskIndex } = transferData;
    this._sections.update((sections) => {
      const fromSectionIndex = sections.findIndex(
        (section) => section.id === fromSection.id
      );
      const toSectionIndex = sections.findIndex(
        (section) => section.id === toSection.id
      );
      const fromTasks = [...sections[fromSectionIndex].tasks];
      const toTasks = [...sections[toSectionIndex].tasks];
      transferArrayItem(fromTasks, toTasks, fromTaskIndex, toTaskIndex);
      const updatedSections = [...sections];
      updatedSections[fromSectionIndex] = { ...updatedSections[fromSectionIndex], tasks: fromTasks};
      updatedSections[toSectionIndex] = { ...updatedSections[toSectionIndex], tasks: toTasks};
      return updatedSections;
    });
  }
  private saveSectionsInLocalStorage() {
    localStorage.setItem('sections', JSON.stringify(this._sections()));
  }
  private getStagesFromLocalStorage(): Section[] {
    const stages = localStorage.getItem('sections');
    if (!stages) return SECTIONS;
    return JSON.parse(stages);
  }
}
