import React from 'react';
import { TaskItem } from './TaskItem';
import { useQuranStore } from '../store/quranStore';
import { normalizeDate } from '../utils/dateUtils';
import { canMemorizeThumn } from '../utils/preparationUtils';

interface ThumnMemorizationProps {
  selectedDate: Date;
}

export const ThumnMemorization: React.FC<ThumnMemorizationProps> = ({ selectedDate }) => {
  const {
    dailyProgress,
    currentThumn,
    incrementThumnRepetition,
    markThumnMemorized
  } = useQuranStore();

  const normalizedDate = normalizeDate(selectedDate);
  const todayProgress = dailyProgress.find(p => 
    p.date instanceof Date && p.date.getTime() === normalizedDate.getTime()
  ) || {
    date: normalizedDate,
    thumnRepetition: 0
  };

  if (!canMemorizeThumn(dailyProgress)) {
    return null;
  }

  const handleMemorization = () => {
    if (todayProgress.thumnRepetition >= 10) {
      markThumnMemorized(currentThumn, normalizedDate);
    } else {
      incrementThumnRepetition(normalizedDate);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">حفظ الثمن</h2>
      <div className="space-y-4">
        <TaskItem
          label={`تكرار الثمن (${todayProgress.thumnRepetition}/10)`}
          completed={todayProgress.thumnRepetition >= 10}
          onClick={handleMemorization}
        />
      </div>
    </div>
  );
};