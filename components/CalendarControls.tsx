import React from 'react';
import { CalendarViewType } from './Dashboard';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';
import { formatDateRangeForDisplay } from '../utils';

interface CalendarControlsProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  calendarView: CalendarViewType;
  setCalendarView: (view: CalendarViewType) => void;
}

const CalendarControls: React.FC<CalendarControlsProps> = ({ currentDate, setCurrentDate, calendarView, setCalendarView }) => {

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (calendarView === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (calendarView === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (calendarView === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (calendarView === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const viewOptions: CalendarViewType[] = ['day', 'week', 'month'];

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center border border-gray-300 rounded-md">
        <button onClick={handlePrev} className="p-2 border-r hover:bg-gray-100">
          <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <button onClick={handleToday} className="px-4 py-1.5 text-sm font-medium border-r hover:bg-gray-100">
          Today
        </button>
        <button onClick={handleNext} className="p-2 hover:bg-gray-100">
          <ChevronRightIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      <h2 className="text-lg font-semibold text-gray-800 min-w-[250px] text-center">
        {formatDateRangeForDisplay(currentDate, calendarView)}
      </h2>
      <div className="flex items-center bg-gray-200 rounded-md p-0.5">
        {viewOptions.map(view => (
          <button 
            key={view} 
            onClick={() => setCalendarView(view)} 
            className={`px-3 py-1 text-sm rounded-md capitalize transition-colors ${calendarView === view ? 'bg-white text-gray-800 shadow-sm' : 'bg-transparent text-gray-600'}`}
          >
            {view}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalendarControls;