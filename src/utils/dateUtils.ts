import { startOfDay } from 'date-fns';

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return startOfDay(date1).getTime() === startOfDay(date2).getTime();
};

export const normalizeDate = (date: Date): Date => {
  return startOfDay(date);
};