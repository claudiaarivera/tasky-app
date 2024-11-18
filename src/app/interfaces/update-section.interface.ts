import { Section } from './section.interface';

export interface UpdateSection extends Partial<Section> {
  id: string;
}
