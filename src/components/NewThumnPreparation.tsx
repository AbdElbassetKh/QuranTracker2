import React from 'react';
import { TaskItem } from './TaskItem';
import { useQuranStore } from '../store/quranStore';
import { normalizeDate } from '../utils/dateUtils';
import { canPrepareNewThumn } from '../utils/preparationUtils';

interface NewThumnPreparationProps {
  selectedDate: Date;
}

export const NewThumnPreparation: React.FC<NewThumnPreparationProps> = ({ selectedDate }) => {
  const {
    dailyProgress,
    currentThumn,
    markTafseerRead,
    markThumnListened,
    markThumnRead
  } = useQuranStore();

  const normalizedDate = normalizeDate(selectedDate);
  const todayProgress = dailyProgress.find(p => 
    p.date instanceof Date && p.date.getTime() === normalizedDate.getTime()
  ) || {
    date: normalizedDate,
    tafseerReading: false,
    thumnListening: false,
    thumnReading: false
  };

  const currentHizbIndex = Math.floor((currentThumn - 1) / 8);
  const currentJuzIndex = Math.floor(currentHizbIndex / 2);
  const currentThumnIndex = (currentThumn - 1) % 8;

  if (!canPrepareNewThumn(dailyProgress)) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">تحضير الثمن الجديد</h2>
      <div className="mb-4">
        <p className="text-gray-600">
          الثمن الحالي: {currentThumnIndex + 1}/8 من الحزب {currentHizbIndex + 1}
        </p>
        <p className="text-gray-600">
          الجزء: {currentJuzIndex + 1}
        </p>
      </div>
      <div className="space-y-4">
        <TaskItem
          label="قراءة التفسير"
          completed={todayProgress.tafseerReading}
          onClick={() => markTafseerRead(normalizedDate)}
        />
        <TaskItem
          label="سماع الثمن"
          completed={todayProgress.thumnListening}
          onClick={() => markThumnListened(normalizedDate)}
        />
        <TaskItem
          label="قراءة الثمن"
          completed={todayProgress.thumnReading}
          onClick={() => markThumnRead(normalizedDate)}
        />
      </div>
    </div>
  );
};