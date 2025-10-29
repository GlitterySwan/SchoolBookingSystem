import React, { useState, useEffect } from 'react';
import { Booking } from '../types';
import { generateBookingSummary } from '../services/geminiService';
import { SpinnerIcon, ChartBarIcon, PrinterIcon, ArrowDownTrayIcon } from './Icons';

interface AdminReportProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
}

const AdminReport: React.FC<AdminReportProps> = ({ isOpen, onClose, bookings }) => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(null);
      setSummary('');

      const fetchSummary = async () => {
        try {
          if (bookings.length === 0) {
              setSummary("There are no bookings for the selected date to generate a report from.");
              return;
          }
          const result = await generateBookingSummary(bookings);
          setSummary(result);
        } catch (e) {
          setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchSummary();
    }
  }, [isOpen, bookings]);

  const handleExportCSV = () => {
    if (bookings.length === 0) return;
    const headers = ['ID', 'Date', 'Room', 'Start Time', 'End Time', 'Category', 'Description', 'User', 'Status', 'Cancellation Reason'];
    const rows = bookings.map(b => [
        b.id,
        b.date,
        b.roomId,
        `${b.startTime}:00`,
        `${b.endTime}:00`,
        b.category,
        `"${b.description.replace(/"/g, '""')}"`, // Handle quotes in description
        b.userName,
        b.status,
        b.cancellationReason ? `"${b.cancellationReason.replace(/"/g, '""')}"` : ''
    ].join(','));
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `booking_report_${bookings[0]?.date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
      window.print();
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl flex flex-col">
        <div id="print-area">
            <div className="flex items-center mb-4">
                <ChartBarIcon className="w-8 h-8 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Booking Summary Report</h2>
            </div>

            <div className="bg-gray-50 p-4 rounded-md min-h-[200px] max-h-[50vh] overflow-y-auto">
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <SpinnerIcon className="w-12 h-12 animate-spin text-indigo-500" />
                  <p className="mt-3">Generating AI summary, please wait...</p>
                </div>
              )}
              {error && (
                <div className="text-red-600">
                  <p className="font-bold">Error generating report:</p>
                  <p>{error}</p>
                </div>
              )}
              {!isLoading && !error && (
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">{summary}</pre>
              )}
            </div>
        </div>

        <div className="flex justify-end items-center mt-6 gap-3 no-print">
          <button onClick={handleExportCSV} disabled={bookings.length === 0} className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-300">
            <ArrowDownTrayIcon className="w-5 h-5" />
            Export CSV
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
             <PrinterIcon className="w-5 h-5" />
            Print Report
          </button>
          <button type="button" onClick={onClose} className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700">Close</button>
        </div>
      </div>
    </div>
  );
};

export default AdminReport;