
import React, { useState } from 'react';
import { CATEGORIES, COLORS, Icons } from '../services/constants.tsx';
import { StudyPlan, DailyTask } from '../types.ts';

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
    
    let studyDayIndexes = [0, 1, 2, 3, 4, 5, 6]; 
    if (frequency === 1) studyDayIndexes = [6]; 
    else if (frequency === 5) studyDayIndexes = [1, 2, 3, 4, 5];

    const tasks: DailyTask[] = [];
    let actualStudyDays: Date[] = [];
    for (let i = 0; i < totalDaysCount; i++) {
      const d = new Date(start); d.setDate(start.getDate() + i);
      if (studyDayIndexes.includes(d.getDay())) actualStudyDays.push(d);
    }

    const pagesPerDay = Math.floor(totalPages / (actualStudyDays.length || 1));
    let studyDayCounter = 0;
    for (let i = 0; i < totalDaysCount; i++) {
      const d = new Date(start); d.setDate(start.getDate() + i);
      const isStudy = studyDayIndexes.includes(d.getDay());
      tasks.push({
        date: d.toISOString().split('T')[0],
        pagesToRead: isStudy ? pagesPerDay : 0,
        isCompleted: false,
        minutesSpent: 0,
        isRestDay: !isStudy
      });
    }

    onSubmit({ subject, category, startDate, endDate, totalPages, frequencyPerWeek: frequency, completedPages: 0, color, tasks, totalMinutes: 0 });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-6">新增學習計劃</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required className="w-full p-3 border rounded-xl" placeholder="科目名稱" value={subject} onChange={e => setSubject(e.target.value)} />
          <select className="w-full p-3 border rounded-xl" value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-4">
            <input type="date" className="p-3 border rounded-xl" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <input type="date" className="p-3 border rounded-xl" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
          <div className="flex gap-4">
            <button type="button" onClick={onCancel} className="flex-1 py-3 border rounded-xl">取消</button>
            <button type="submit" className="flex-1 py-3 bg-[#A9927D] text-white rounded-xl font-bold">建立</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanForm;
