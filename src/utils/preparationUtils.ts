import { DailyProgress } from '../types/quran';
import { addDays, isBefore, isAfter, startOfDay } from 'date-fns';

export const PREPARATION_DAYS = 8;

export function getPreparationStartDate(dailyProgress: DailyProgress[]): Date {
  const sortedProgress = [...dailyProgress]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const lastPreparationDate = sortedProgress.find(p => p.preparationReading)?.date;
  
  if (!lastPreparationDate) {
    return startOfDay(new Date()); // Start today if no previous preparation
  }
  
  // If we have previous preparation, start from the last date
  return startOfDay(new Date(lastPreparationDate));
}

export function canPrepareNewThumn(dailyProgress: DailyProgress[]): boolean {
  const startDate = getPreparationStartDate(dailyProgress);
  const today = startOfDay(new Date());
  const preparationEndDate = addDays(startDate, PREPARATION_DAYS - 1);
  
  // Can only prepare new thumn on the last day of preparation period
  return isBefore(startDate, today) && 
         !isAfter(today, preparationEndDate) && 
         isBefore(addDays(startDate, PREPARATION_DAYS - 2), today);
}

export function canMemorizeThumn(dailyProgress: DailyProgress[]): boolean {
  const startDate = getPreparationStartDate(dailyProgress);
  const today = startOfDay(new Date());
  const preparationEndDate = addDays(startDate, PREPARATION_DAYS - 1);
  
  // Can memorize thumn the day after preparation period ends
  return isAfter(today, preparationEndDate);
}