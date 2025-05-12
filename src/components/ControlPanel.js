 import React, { useState, useEffect, useRef } from 'react';
import { Clock, Settings as SettingsIcon, Calendar, Sun, Moon, Plus, Timer, ChevronDown, ChevronUp } from 'lucide-react';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';
import Settings from './Settings';

const TimeInput = React.forwardRef(({ label, value, onChange, max, onKeyDown }, ref) => (
  <div className="relative">
    <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">{label}</label>
    <input
      ref={ref}
      type="number"
      min="0"
      max={max}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-base font-mono transition-all duration-200 hover:border-blue-400"
    />
  </div>
));

const ToggleSwitch = ({ checked, onChange, label }) => (
  <label className="flex items-center cursor-pointer group">
    <div className="relative">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div className={`block w-14 h-8 rounded-full transition-colors duration-200 ${
        checked ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
      }`} />
      <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ${
        checked ? 'translate-x-6' : 'translate-x-0'
      }`} />
    </div>
    <span className="ml-3 text-sm text-gray-700 dark:text-gray-200">{label}</span>
  </label>
);

const ControlPanel = ({ 
  onTimeSet, 
  onThemeToggle, 
  isDark, 
  onShowSchedule, 
  timeData, 
  onAddTime 
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [countUp, setCountUp] = useState(false);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [currentDisplayTime, setCurrentDisplayTime] = useState(0);
  const [headerButtonsCollapsed, setHeaderButtonsCollapsed] = useState(false);
  
  const hoursRef = useRef(null);
  const minutesRef = useRef(null);
  const secondsRef = useRef(null);

  const validateTime = () => {
    if (!hours && !minutes && !seconds) {
      setError('Please set at least one time value');
      return false;
    }
    if (minutes >= 60 || seconds >= 60) {
      setError('Minutes and seconds must be less than 60');
      return false;
    }
    setError('');
    return true;
  };

  const handleStart = () => {
    if (!validateTime()) return;
    const totalSeconds = 
      (parseInt(hours) || 0) * 3600 + 
      (parseInt(minutes) || 0) * 60 + 
      (parseInt(seconds) || 0);
    
    const newTimerData = {
      totalSeconds,
      countUp,
      title: title || 'Timer',
      timestamp: new Date().toISOString(),
      startTime: Date.now()
    };
    
    onTimeSet(newTimerData);
    
    if (window.electron) {
      window.electron.sendTimerUpdate(newTimerData);
    }
    
    setHours('');
    setMinutes('');
    setSeconds('');
    setTitle('');
  };

  const handleAddTime = () => {
    if (!validateTime()) return;
    const additionalSeconds = 
      (parseInt(hours) || 0) * 3600 + 
      (parseInt(minutes) || 0) * 60 + 
      (parseInt(seconds) || 0);
    
    const newTotalSeconds = currentDisplayTime + additionalSeconds;
    
    const now = Date.now();
    const updatedTimerData = {
      ...timeData,
      totalSeconds: newTotalSeconds,
      startTime: now - ((timeData.totalSeconds - currentDisplayTime) * 1000)
    };
    
    onTimeSet(updatedTimerData);
    
    if (window.electron) {
      window.electron.sendTimerUpdate(updatedTimerData);
    }
    
    setHours('');
    setMinutes('');
    setSeconds('');
  };

  const handleTimeInputKeyDown = (e) => {
  // Only prevent default and handle space navigation in time inputs
  if (e.target === hoursRef.current || 
      e.target === minutesRef.current || 
      e.target === secondsRef.current) {
    if (e.key === ' ') {
      e.preventDefault();
      if (e.target === hoursRef.current) {
        minutesRef.current.focus();
      } else if (e.target === minutesRef.current) {
        secondsRef.current.focus();
      } else if (e.target === secondsRef.current) {
        hoursRef.current.focus();
      }
    }
  }
  
  // Handle Enter for all inputs
  if (e.key === 'Enter') {
    e.preventDefault();
    handleStart();
  }
};

  const shortcuts = [
    { key: 'Enter', action: handleStart },
    { key: 'a', action: handleAddTime },
    { key: 't', action: onThemeToggle },
    { key: 's', action: onShowSchedule },
    { key: 'k', action: () => setShowSettings(true) },
    { key: 'Escape', action: () => setShowSettings(false) }
  ];

  useKeyboardShortcuts(shortcuts);

  useEffect(() => {
    if (!timeData) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - timeData.startTime) / 1000);
      const remaining = timeData.totalSeconds - elapsed;
      const currentTime = remaining <= 0 ? (timeData.countUp ? Math.abs(remaining) : 0) : remaining;
      
      setCurrentDisplayTime(currentTime);
      
      if (window.electron) {
        window.electron.sendTimerUpdate({
          ...timeData,
          currentTime,
          isTimeUp: remaining <= 0
        });
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [timeData]);

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '--:--';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0 
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (showSettings) {
    return <Settings onBack={() => setShowSettings(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              BackstagePro
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <div 
              className={`flex space-x-2 transition-all duration-300 ${
                headerButtonsCollapsed ? 'opacity-0 max-w-0 overflow-hidden' : 'opacity-100 max-w-full'
              }`}
            >
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                title="Settings (K)"
              >
                <SettingsIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
              <button
                onClick={onShowSchedule}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                title="Show Schedule (S)"
              >
                <Calendar className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
              <button
                onClick={onThemeToggle}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                title="Toggle Theme (T)"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
            <button
              onClick={() => setHeaderButtonsCollapsed(!headerButtonsCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              title={headerButtonsCollapsed ? 'Expand Buttons' : 'Collapse Buttons'}
            >
              {headerButtonsCollapsed ? (
                <ChevronDown className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <ChevronUp className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {timeData && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">{timeData.title}</h2>
              <div className="flex items-center space-x-2">
                <Timer className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Active Timer</span>
              </div>
            </div>
            <div className="text-9xl font-mono text-blue-600 dark:text-blue-400 text-center">
              {formatTime(currentDisplayTime)}
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">Event Title</label>
            <input
              type="text"
              placeholder="Enter event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleTimeInputKeyDown}
              className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-base transition-all duration-200 hover:border-blue-400"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <TimeInput 
              ref={hoursRef}
              label="Hours" 
              value={hours} 
              onChange={setHours}
              onKeyDown={handleTimeInputKeyDown}
            />
            <TimeInput 
              ref={minutesRef}
              label="Minutes" 
              value={minutes} 
              onChange={setMinutes} 
              max={59}
              onKeyDown={handleTimeInputKeyDown}
            />
            <TimeInput 
              ref={secondsRef}
              label="Seconds" 
              value={seconds} 
              onChange={setSeconds} 
              max={59}
              onKeyDown={handleTimeInputKeyDown}
            />
          </div>

          <div className="mb-6">
            <ToggleSwitch 
              checked={countUp} 
              onChange={(e) => setCountUp(e.target.checked)}
              label="Count up after timeout"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleStart}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
              title="Press Enter to start"
            >
              <Timer className="w-4 h-4" />
              <span>Start Timer</span>
            </button>
            
            {timeData && (
              <button
                onClick={handleAddTime}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
                title="Press A to add time"
              >
                <Plus className="w-4 h-4" />
                <span>Add Time</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;