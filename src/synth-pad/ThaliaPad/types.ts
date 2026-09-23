import { ClassValue } from 'cn';

export type Position = 'left' | 'right';

export interface ThaliaPadConfigItem {
  playingClasses: ClassValue;
  extraClasses: ClassValue;
}
