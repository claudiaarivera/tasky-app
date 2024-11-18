import { Section } from './section.interface';

export interface TransferTaskData {
  fromSection: Section;
  toSection: Section;
  fromTaskIndex: number;
  toTaskIndex: number;
}
