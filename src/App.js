import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import ControlPanel from './components/ControlPanel';
import DisplayScreen from './components/DisplayScreen';
import Schedule from './components/Schedule';
import SplashScreen from './components/SplashScreen';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [timeData, setTimeData] = useState(null);
  const [events, setEvents] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);

  const handleTimeSet = (data) => {
    console.log('Timer started with data:', data);
    const newTimeData = {
      ...data,
      startTime: Date.now(),
      currentTime: data.totalSeconds
    };
    setTimeData(newTimeData);
    setEvents(prev => [...prev, newTimeData]);
    
    // Use the electron bridge to send timer updates
    if (window.electron) {
      window.electron.sendTimerUpdate(newTimeData);
    }
  };

  const handleAddTime = (additionalSeconds) => {
    if (!timeData) return;
    
    const updatedTimeData = {
      ...timeData,
      totalSeconds: timeData.totalSeconds + additionalSeconds,
      startTime: Date.now() - ((timeData.totalSeconds - timeData.currentTime) * 1000)
    };
    
    setTimeData(updatedTimeData);
    setEvents(prev => [...prev, updatedTimeData]);
    
    // Send update to display window
    if (window.electron) {
      window.electron.sendTimerUpdate(updatedTimeData);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Listen for timer updates from the main process
    if (window.electron) {
      window.electron.onTimerUpdate((data) => {
        setTimeData(data);
      });

      return () => {
        window.electron.removeListeners();
      };
    }
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  const MainContent = () => (
    <div className={isDark ? 'dark' : ''}>
      {showSchedule ? (
        <Schedule 
          events={events} 
          onBack={() => setShowSchedule(false)}
        />
      ) : (
        <ControlPanel
          onTimeSet={handleTimeSet}
          onThemeToggle={() => {
            setIsDark(!isDark);
            if (window.electron) {
              window.electron.sendThemeChange(!isDark);
            }
          }}
          isDark={isDark}
          onShowSchedule={() => setShowSchedule(true)}
          timeData={timeData}
          onAddTime={handleAddTime}
        />
      )}
    </div>
  );

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/display" element={<DisplayScreen timeData={timeData} isDark={isDark} />} />
      </Routes>
    </HashRouter>
  );
}

export default App;