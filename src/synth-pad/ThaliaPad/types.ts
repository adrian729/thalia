import { ClassValue } from 'cn';

export type Position = 'left' | 'right';

export interface ThaliaPadConfigItem {
  id: number;
  scaleValue: number;
  playingClasses: ClassValue;
  extraClasses: ClassValue;
}
