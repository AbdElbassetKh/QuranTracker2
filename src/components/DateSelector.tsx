import React from 'react';
import { addDays, format, subDays } from 'date-fns';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { ar } from 'date-fns/locale';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onDateChange }) => {
  const handlePreviousDay = () => {
    onDateChange(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    const tomorrow = addDays(new Date(), 1);
    const nextDay = addDays(selectedDate, 1);
    if (nextDay <= tomorrow) {
      onDateChange(nextDay);
    }
  };

  return (
    <div className="flex items-center justify-between bg-white rounded-lg shadow p-4 mb-6">
      <button
        onClick={handlePreviousDay}
        className="p-2 hover:bg-gray-100 rounded-lg"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      
      <h2 className="text-lg font-semibold">
        {format(selectedDate, 'EEEE، d MMMM yyyy', { locale: ar })}
      </h2>

      <button
        onClick={handleNextDay}
        className="p-2 hover:bg-gray-100 rounded-lg"
        disabled={selectedDate >= new Date()}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    </div>
  );
};