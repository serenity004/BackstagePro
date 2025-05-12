import React, { useState, useEffect } from 'react';

const DisplayScreen = ({ timeData: propTimeData }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [timeData, setTimeData] = useState(propTimeData);

  useEffect(() => {
    const handleTimerUpdate = (newTimeData) => {
      setTimeData(newTimeData);
      setCurrentTime(newTimeData.currentTime);
      setIsTimeUp(newTimeData.isTimeUp);
    };

    if (window.electron) {
      window.electron.onTimerUpdate(handleTimerUpdate);
    }

    return () => {
      if (window.electron) {
        window.electron.removeListeners();
      }
    };
  }, []);

  useEffect(() => {
    if (propTimeData) {
      setTimeData(propTimeData);
    }
  }, [propTimeData]);

  useEffect(() => {
    if (!timeData) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - timeData.startTime) / 1000);
      const remaining = timeData.totalSeconds - elapsed;

      if (remaining <= 0) {
        setIsTimeUp(true);
        if (timeData.countUp) {
          setCurrentTime(Math.abs(remaining));
        } else {
          setCurrentTime(0);
        }
      } else {
        setIsTimeUp(false);
        setCurrentTime(remaining);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [timeData]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!timeData) {
    return (
      <div className="h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-8xl mb-4 font-['Digital-7']">Welcome to Church</h1>
        <p className="text-4xl text-gray-400 font-['Digital-7']">Waiting for timer...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      {!isTimeUp && (
        <h2 
          className="text-[120px] leading-tight mb-12 text-center px-4 font-bold tracking-tight" 
          style={{
            fontFamily: 'Helvetica Neue, Arial, sans-serif',
            textShadow: '0 0 20px rgba(255,255,255,0.2)'
          }}
        >
          {timeData.title}
        </h2>
      )}
      {isTimeUp && !timeData.countUp ? (
        <div className="flex items-center justify-center h-full w-full">
          <div 
            className="text-[350px] font-extrabold animate-[blink_1s_steps(2,_start)_infinite] text-center"
            style={{
              fontFamily: 'Helvetica Neue, Arial, sans-serif',
              color: '#FF0000',
              textShadow: '0 0 30px rgba(255,0,0,0.3)',
              animation: 'blink 1s steps(2, start) infinite'
            }}
          >
            TIME UP
          </div>
          <style jsx>{`
            @keyframes blink {
              0%, 49% {
                opacity: 1;
                transform: scale(1.1);
              }
              50%, 100% {
                opacity: 0;
                transform: scale(1);
              }
            }
          `}</style>
        </div>
      ) : (
        <div
          className={`font-['Digital-7'] text-[700px] leading-none mb-8 ${
            timeData.countUp && isTimeUp ? 'text-[#FF0000]' : ''
          }`}
          style={{
            letterSpacing: '8px',
            textShadow: '0 0 20px rgba(255,255,255,0.2)'
          }}
        >
          {formatTime(currentTime)}
        </div>
      )}
      {isTimeUp && timeData.countUp && (
        <div className="text-6xl text-[#FF0000] font-['Digital-7']">
          Time elapsed
        </div>
      )}
    </div>
  );
};

export default DisplayScreen;