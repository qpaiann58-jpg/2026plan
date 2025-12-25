
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../services/constants.tsx';

interface PomodoroTimerProps {
  onSessionComplete: (minutes: number) => void;
  isActiveSession: boolean;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onSessionComplete, isActiveSession }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [studyDuration, setStudyDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(studyDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'study' | 'break'>('study');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerEnd();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(mode === 'study' ? studyDuration * 60 : breakDuration * 60);
    }
  }, [studyDuration, breakDuration, mode, isRunning]);

  const handleTimerEnd = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    
    if (mode === 'study') {
      onSessionComplete(studyDuration);
      alert('太棒了！專注時段結束，休息一下吧！');
      setMode('break');
      setTimeLeft(breakDuration * 60);
    } else {
      alert('休息結束，準備好繼續挑戰了嗎？');
      setMode('study');
      setTimeLeft(studyDuration * 60);
    }
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'study' ? studyDuration * 60 : breakDuration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const applySettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSettingsOpen(false);
    resetTimer();
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {isOpen ? (
        <div className="bg-[#4F4238] text-[#FDF8F5] rounded-3xl p-6 shadow-2xl w-72 animate-fade-in border border-[#8E7D6F]">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#D5BDAF]">
                {mode === 'study' ? '專注時段' : '休息時間'}
              </h3>
              <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="p-1 hover:text-[#D5BDAF] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-[#D5BDAF] hover:text-[#FDF8F5]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>
          </div>
          
          {isSettingsOpen ? (
            <form onSubmit={applySettings} className="space-y-4 mb-4 bg-[#3E342B] p-4 rounded-xl">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#D5BDAF] mb-1">專注 (分)</label>
                  <input 
                    type="number" 
                    className="w-full bg-[#4F4238] border border-[#8E7D6F] rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#D5BDAF]"
                    value={studyDuration}
                    onChange={(e) => setStudyDuration(Number(e.target.value))}
                    min="1"
                    max="120"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#D5BDAF] mb-1">休息 (分)</label>
                  <input 
                    type="number" 
                    className="w-full bg-[#4F4238] border border-[#8E7D6F] rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#D5BDAF]"
                    value={breakDuration}
                    onChange={(e) => setBreakDuration(Number(e.target.value))}
                    min="1"
                    max="60"
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#A9927D] py-1.5 rounded-lg text-xs font-bold hover:bg-[#D5BDAF] transition-colors">確認修改</button>
            </form>
          ) : (
            <>
              <div className="text-6xl font-mono font-bold text-center mb-8 tracking-tighter text-[#FDF8F5]">
                {formatTime(timeLeft)}
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={toggleTimer}
                  className={`flex-1 py-3 rounded-2xl font-bold transition-all shadow-lg ${isRunning ? 'bg-[#D5BDAF] hover:bg-[#F5EBE0] text-[#4F4238]' : 'bg-[#A9927D] hover:bg-[#8E7D6F] text-white'}`}
                >
                  {isRunning ? '暫停' : '開始專注'}
                </button>
                <button 
                  onClick={resetTimer}
                  className="px-4 py-3 bg-[#3E342B] rounded-2xl hover:bg-[#2D241C] transition-colors border border-[#8E7D6F]/30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95 ${isRunning ? 'bg-[#A9927D] animate-pulse text-white' : 'bg-[#4F4238] text-[#FDF8F5]'}`}
        >
          {isRunning ? (
            <span className="font-mono text-xs font-bold">{formatTime(timeLeft)}</span>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          )}
        </button>
      )}
    </div>
  );
};

export default PomodoroTimer;
