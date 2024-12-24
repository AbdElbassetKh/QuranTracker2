import React from 'react';
import { TaskItem } from './TaskItem';
import { useQuranStore } from '../store/quranStore';
import { normalizeDate } from '../utils/dateUtils';

interface WeeklyPreparationProps {
  selectedDate: Date;
}

export const WeeklyPreparation: React.FC<WeeklyPreparationProps> = ({ selectedDate }) => {
  const { dailyProgress, markPreparationRead } = useQuranStore();
  const normalizedDate = normalizeDate(selectedDate);
  
  const todayProgress = dailyProgress.find(p => 
    p.date instanceof Date && p.date.getTime() === normalizedDate.getTime()
  ) || {
    date: normalizedDate,
    preparationReading: false
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">التحضير الأسبوعي</h2>
      <div className="space-y-4">
        <TaskItem
          label="قراءة التحضير"
          completed={todayProgress.preparationReading}
          onClick={() => markPreparationRead(normalizedDate)}
        />
      </div>
    </div>
  );
};