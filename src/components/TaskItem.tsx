import React from 'react';
import { Check } from 'lucide-react';

interface TaskItemProps {
  label: string;
  completed?: boolean;
  onClick: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ label, completed, onClick }) => (
  <button
    className={`flex items-center justify-between w-full p-3 rounded-lg ${
      completed
        ? 'bg-green-50 text-green-700'
        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
    }`}
    onClick={onClick}
  >
    <span>{label}</span>
    <Check className={`w-5 h-5 ${completed ? 'opacity-100' : 'opacity-0'}`} />
  </button>
);