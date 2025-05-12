import React from 'react';
import { ArrowLeft, Keyboard } from 'lucide-react';

const Settings = ({ onBack }) => {
  const shortcuts = [
    { key: 'Enter', action: 'Start new timer' },
    { key: 'A', action: 'Add time to current timer' },
    { key: 'T', action: 'Toggle theme' },
    { key: 'S', action: 'Show/hide schedule' },
    { key: 'Space', action: 'Move between time input fields' },
    { key: 'K', action: 'Show keyboard shortcuts' },
    { key: 'Esc', action: 'Return to previous screen' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Keyboard className="w-6 h-6 text-blue-500" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Keyboard Shortcuts
              </h3>
            </div>
            
            <div className="grid gap-4">
              {shortcuts.map((shortcut, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <span className="text-gray-700 dark:text-gray-200">
                    {shortcut.action}
                  </span>
                  <kbd className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded text-gray-700 dark:text-gray-300 font-mono min-w-[40px] text-center">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;