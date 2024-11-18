import { PriorityLevel } from "./priority-level.type";

export interface Priority {
  level: PriorityLevel;
  color: 'red' | 'yellow' | 'blue';
}