import React, { useState } from 'react';
import { useQuranStore } from '../store/quranStore';
import { Book, Headphones, BookOpen, RefreshCw } from 'lucide-react';
import { normalizeDate } from '../utils/dateUtils';
import { TaskItem } from './TaskItem';
import { WeeklyPreparation } from './WeeklyPreparation';
import { NewThumnPreparation } from './NewThumnPreparation';
import { ThumnMemorization } from './ThumnMemorization';
import { DateSelector } from './DateSelector';

export const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const {
    juzs,
    dailyProgress,
    markJuzRead,
    markHizbListened,
  } = useQuranStore();

  const normalizedDate = normalizeDate(selectedDate);
  const todayProgress = dailyProgress.find(p => 
    p.date instanceof Date && p.date.getTime() === normalizedDate.getTime()
  ) || {
    date: normalizedDate,
    juzReading: false,
    hizbListening: false
  };

  const memorizedCount = juzs
    .flatMap(juz => juz.hizbs)
    .flatMap(hizb => hizb.athman)
    .filter(thumn => thumn.memorized)
    .length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            حافظ القرآن
          </h1>
          
          <DateSelector 
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="الأثمان المحفوظة"
              value={memorizedCount}
              total={480}
              icon={<Book className="w-6 h-6" />}
            />
            <StatCard
              title="الأحزاب المحفوظة"
              value={Math.floor(memorizedCount / 8)}
              total={60}
              icon={<BookOpen className="w-6 h-6" />}
            />
            <StatCard
              title="الأجزاء المحفوظة"
              value={Math.floor(memorizedCount / 16)}
              total={30}
              icon={<Book className="w-6 h-6" />}
            />
            <StatCard
              title="نسبة الإنجاز"
              value={Math.round((memorizedCount / 480) * 100)}
              suffix="%"
              icon={<RefreshCw className="w-6 h-6" />}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">الورد اليومي</h2>
              <div className="space-y-4">
                <TaskItem
                  label="قراءة الجزء"
                  completed={todayProgress.juzReading}
                  onClick={() => markJuzRead(normalizedDate)}
                />
                <TaskItem
                  label="سماع الحزب"
                  completed={todayProgress.hizbListening}
                  onClick={() => markHizbListened(normalizedDate)}
                />
              </div>
            </div>
            
            <WeeklyPreparation selectedDate={selectedDate} />
            <NewThumnPreparation selectedDate={selectedDate} />
            <ThumnMemorization selectedDate={selectedDate} />
          </div>
        </div>
      </div>
    </div>
  );
};