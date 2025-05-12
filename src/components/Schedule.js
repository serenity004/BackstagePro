import React from 'react';
import { ArrowLeft, Download, Clock } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Schedule = ({ events = [], onBack }) => {
  const formatTime = (seconds) => {
    if (typeof seconds !== 'number') return '--:--:--';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Schedule History', 14, 15);

    doc.autoTable({
      head: [['Date/Time', 'Title', 'Duration', 'Added Time', 'Lag']],
      body: events.map(event => [
        formatDateTime(event.timestamp),
        event.title,
        formatTime(event.totalSeconds),
        formatTime(event.addedTime || 0),
        formatTime(event.lag || 0)
      ]),
      startY: 25,
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontSize: 11,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
    });

    doc.save('schedule-history.pdf');
  };

  const hasEvents = Array.isArray(events) && events.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Schedule History</h2>
              </div>
            </div>
            
            <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 shadow-sm"
            >
              <Download className="w-5 h-5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Date/Time
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Added Time
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Lag
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {!hasEvents ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                        <Clock className="w-12 h-12 mb-4 opacity-50" />
                        <p className="text-lg font-medium">No events recorded yet</p>
                        <p className="text-sm">Events will appear here once you start using the timer</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  events.map((event, index) => (
                    <tr 
                      key={index}
                      className={`
                        ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'}
                        hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150
                      `}
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {formatDateTime(event.timestamp)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-medium">
                        {event.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-mono">
                        {formatTime(event.totalSeconds)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-mono">
                        {formatTime(event.addedTime || 0)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-mono">
                        {formatTime(event.lag || 0)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;