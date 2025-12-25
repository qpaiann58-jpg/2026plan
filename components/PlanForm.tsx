
import React, { useState } from 'react';
import { CATEGORIES, COLORS, Icons } from '../services/constants';
import { StudyPlan, DailyTask } from '../types';

interface PlanFormProps {
  onSubmit: (plan: Omit<StudyPlan, 'id'>) => void;
  onCancel: () => void;
}

const PlanForm: React.FC<PlanFormProps> = ({ onSubmit, onCancel }) => {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('2026-12-31');
  const [totalPages, setTotalPages] = useState(100);
  const [frequency, setFrequency] = useState(7); 
  const [color, setColor] = useState(COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDaysCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    let studyDayIndexes: number[] = [];
    if (frequency === 1) studyDayIndexes = [6]; 
    else if (frequency === 2) studyDayIndexes = [2, 4]; 
    else if (frequency === 3) studyDayIndexes = [1, 3, 5]; 
    else if (frequency === 4) studyDayIndexes = [1, 3, 5, 0]; 
    else if (frequency === 5) studyDayIndexes = [1, 2, 3, 4, 5]; 
    else if (frequency === 6) studyDayIndexes = [1, 2, 3, 4, 5, 6]; 
    else studyDayIndexes = [0, 1, 2, 3, 4, 5, 6]; 

    const tasks: DailyTask[] = [];
    let actualStudyDays: Date[] = [];

    for (let i = 0; i < totalDaysCount; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      if (studyDayIndexes.includes(currentDate.getDay())) {
        actualStudyDays.push(currentDate);
      }
    }

    const studyDaysCount = actualStudyDays.length || 1;
    const pagesPerStudyDay = Math.floor(totalPages / studyDaysCount);
    const extraPages = totalPages % studyDaysCount;

    let studyDayCounter = 0;
    for (let i = 0; i < totalDaysCount; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      const isStudyDay = studyDayIndexes.includes(currentDate.getDay());
      
      let pagesToRead = 0;
      if (isStudyDay) {
        pagesToRead = pagesPerStudyDay + (studyDayCounter < extraPages ? 1 : 0);
        studyDayCounter++;
      }

      tasks.push({
        date: currentDate.toISOString().split('T')[0],
        pagesToRead: pagesToRead,
        isCompleted: false,
        minutesSpent: 0,
        isRestDay: !isStudyDay
      });
    }

    onSubmit({
      subject,
      category,
      startDate,
      endDate,
      totalPages,
      frequencyPerWeek: frequency,
      completedPages: 0,
      color,
      tasks,
      totalMinutes: 0
    });
  };

  return (
    <div className="fixed inset-0 bg-[#4F4238]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#FDF8F5] rounded-[2.5rem] shadow-2xl w-full max-w-md animate-fade-in overflow-hidden border border-[#D5BDAF]/30">
        <div className="px-8 py-6 border-b border-[#D5BDAF]/10 flex justify-between items-center bg-white/50">
          <h2 className="text-2xl font-black text-[#4F4238] tracking-tight">開啟新的學習旅程</h2>
          <button onClick={onCancel} className="text-[#D5BDAF] hover:text-[#4F4238] transition-colors p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-[11px] font-black text-[#8E7D6F] uppercase tracking-widest mb-2">科目名稱</label>
            <input 
              required
              type="text" 
              className="w-full px-5 py-3 rounded-2xl border border-[#D5BDAF]/30 bg-white focus:ring-2 focus:ring-[#A9927D] outline-none transition-all text-[#4F4238] font-medium"
              placeholder="例如：多益單字、聽力練習..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black text-[#8E7D6F] uppercase tracking-widest mb-2">分類</label>
              <select 
                className="w-full px-5 py-3 rounded-2xl border border-[#D5BDAF]/30 bg-white focus:ring-2 focus:ring-[#A9927D] outline-none text-[#4F4238] font-medium appearance-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-black text-[#8E7D6F] uppercase tracking-widest mb-2">總數 (頁/單元)</label>
              <input 
                required
                type="number" 
                min="1"
                className="w-full px-5 py-3 rounded-2xl border border-[#D5BDAF]/30 bg-white focus:ring-2 focus:ring-[#A9927D] outline-none text-[#4F4238] font-medium"
                value={totalPages}
                onChange={(e) => setTotalPages(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="flex justify-between text-[11px] font-black text-[#8E7D6F] uppercase tracking-widest mb-2">
              <span>每週讀書頻率</span>
              <span className="text-[#A9927D]">每週 {frequency} 天</span>
            </label>
            <input 
              type="range" 
              min="1" 
              max="7" 
              step="1"
              className="w-full h-2 bg-[#F5EBE0] rounded-lg appearance-none cursor-pointer accent-[#A9927D]"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
            />
            <div className="flex justify-between mt-1 px-1">
              {[1, 2, 3, 4, 5, 6, 7].map(n => (
                <span key={n} className="text-[9px] font-bold text-[#D5BDAF]">{n}</span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black text-[#8E7D6F] uppercase tracking-widest mb-2">開始日期</label>
              <input 
                required
                type="date" 
                className="w-full px-5 py-3 rounded-2xl border border-[#D5BDAF]/30 bg-white focus:ring-2 focus:ring-[#A9927D] outline-none text-[#4F4238] font-medium text-xs"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-[#8E7D6F] uppercase tracking-widest mb-2">結束日期</label>
              <input 
                required
                type="date" 
                min={startDate}
                className="w-full px-5 py-3 rounded-2xl border border-[#D5BDAF]/30 bg-white focus:ring-2 focus:ring-[#A9927D] outline-none text-[#4F4238] font-medium text-xs"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black text-[#8E7D6F] uppercase tracking-widest mb-3">代表顏色</label>
            <div className="flex gap-3 bg-[#F5EBE0]/50 p-3 rounded-2xl border border-[#D5BDAF]/20">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-9 h-9 rounded-2xl ${c} ring-offset-2 transition-all shadow-sm ${color === c ? 'ring-2 ring-[#4F4238] scale-110 shadow-md' : 'opacity-40'}`}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 rounded-2xl border border-[#D5BDAF]/30 text-[#8E7D6F] font-bold hover:bg-[#F5EBE0] transition-colors"
            >
              取消
            </button>
            <button 
              type="submit"
              className="flex-1 px-6 py-3 rounded-2xl bg-[#A9927D] text-white font-bold hover:bg-[#8E7D6F] shadow-xl shadow-[#A9927D]/20 transition-all flex items-center justify-center gap-2"
            >
              <Icons.Plus /> 確認建立
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanForm;
