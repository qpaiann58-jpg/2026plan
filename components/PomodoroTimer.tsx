
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../services/constants.tsx';

interface PomodoroTimerProps {
  onSessionComplete: (minutes: number) => void;
  isActiveSession: boolean;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onSessionComplete, isActiveSession }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  
  useEffect(() => {
    let timer: any;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      onSessionComplete(25);
      alert('時間到！休息一下吧！');
      setTimeLeft(25 * 60);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {isOpen ? (
        <div className="bg-[#4F4238] text-white p-6 rounded-3xl shadow-2xl w-64">
          <div className="flex justify-between mb-4">
            <span className="text-xs font-bold opacity-50">FOCUS TIMER</span>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="text-5xl font-mono font-bold text-center mb-6">{formatTime(timeLeft)}</div>
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className="w-full py-3 bg-[#A9927D] rounded-xl font-bold"
          >
            {isRunning ? '暫停' : '開始'}
          </button>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="w-14 h-14 bg-[#4F4238] rounded-full flex items-center justify-center text-white shadow-xl">
          <Icons.Calendar />
        </button>
      )}
    </div>
  );
};

export default PomodoroTimer;
