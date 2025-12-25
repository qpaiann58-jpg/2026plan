
import React, { useState, useMemo } from 'react';
import { StudyPlan, FixedEvent, ProjectPlan } from '../types.ts';
import { Icons } from '../services/constants.tsx';

interface StatsViewProps {
  plans: StudyPlan[];
  fixedEvents: FixedEvent[];
  projects: ProjectPlan[];
  onAISchedule: (text: string) => void;
  onClearEvents: () => void;
  onDeleteEvent: (id: string) => void;
}

const AIScheduleInput: React.FC<{ onAISchedule: (text: string) => void, onClearEvents: () => void }> = ({ onAISchedule, onClearEvents }) => {
  const [aiInput, setAiInput] = useState('');

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    onAISchedule(aiInput);
    setAiInput('');
  };

  return (
    <div className="bg-white/70 p-6 rounded-[2.5rem] border border-[#D5BDAF]/30 shadow-sm">
      <form onSubmit={handleAiSubmit} className="flex gap-4">
        <div className="flex-1 relative">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A9927D]">
            <Icons.Sparkles />
          </div>
          <input 
            type="text" 
            placeholder="試試：『每週四天多益，每次兩小時』或『週五晚上八點健身』..."
            className="w-full pl-14 pr-6 py-4 rounded-2xl border border-[#D5BDAF]/20 bg-[#FDF8F5] focus:ring-2 focus:ring-[#A9927D] outline-none transition-all font-medium text-sm"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
          />
        </div>
        <button 
          type="submit"
          className="px-8 py-4 bg-[#4F4238] text-white rounded-2xl font-bold hover:bg-[#3E342B] transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
        >
          <Icons.Plus /> 自動排程
        </button>
        <button 
          type="button"
          onClick={onClearEvents}
          className="px-4 py-4 bg-rose-50 text-rose-500 rounded-2xl border border-rose-100 hover:bg-rose-100 transition-all shrink-0"
          title="清除所有行程"
        >
          <Icons.Trash />
        </button>
      </form>
    </div>
  );
};

// 時間軸修正為 07:00 ~ 23:00 (每格一小時，涵蓋到 24:00)
const HOURS = Array.from({ length: 17 }, (_, i) => i + 7);
const DAYS = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];

const StatsView: React.FC<StatsViewProps> = ({ plans, fixedEvents, onAISchedule, onClearEvents, onDeleteEvent, projects }) => {
  
  const scheduleLookup = useMemo(() => {
    const map = new Map<string, { id: string, type: string, title: string, color: string }>();
    
    fixedEvents.forEach(e => {
      const startH = parseInt(e.startTime.split(':')[0]);
      const endH = parseInt(e.endTime.split(':')[0]) || 24;
      
      for (let h = startH; h < endH; h++) {
        map.set(`${e.dayOfWeek}-${h}`, {
          id: e.id,
          type: e.isAI ? 'study' : 'fixed',
          title: e.title,
          color: e.isAI ? 'bg-[#A9927D] text-white' : 'bg-[#4F4238] text-white'
        });
      }
    });
    
    return map;
  }, [fixedEvents]);

  return (
    <div className="animate-fade-in max-w-6xl mx-auto space-y-6">
      <AIScheduleInput onAISchedule={onAISchedule} onClearEvents={onClearEvents} />

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-[#D5BDAF]/30 overflow-hidden">
        <div className="grid grid-cols-8 border-b border-[#D5BDAF]/10 bg-[#F5EBE0]/30">
          <div className="p-4 border-r border-[#D5BDAF]/10 text-center text-[10px] font-black text-[#8E7D6F] uppercase tracking-widest">Time</div>
          {DAYS.map((day, i) => (
            <div key={day} className={`p-4 text-center text-sm font-black text-[#4F4238] ${i === 6 ? '' : 'border-r border-[#D5BDAF]/10'}`}>
              {day}
            </div>
          ))}
        </div>

        <div className="h-[600px] overflow-y-auto custom-scrollbar">
          {HOURS.map(hour => (
            <div key={hour} className="grid grid-cols-8 border-b border-[#D5BDAF]/5 group hover:bg-[#FDF8F5]/50 transition-colors">
              <div className="p-3 border-r border-[#D5BDAF]/10 text-[10px] font-bold text-[#D5BDAF] text-center flex items-center justify-center">
                {hour.toString().padStart(2, '0')}:00
              </div>

              {Array.from({ length: 7 }).map((_, dayIdx) => {
                const event = scheduleLookup.get(`${dayIdx}-${hour}`);
                return (
                  <div key={dayIdx} className={`min-h-[70px] p-1 flex flex-col gap-1 ${dayIdx === 6 ? '' : 'border-r border-[#D5BDAF]/10'} relative group/cell`}>
                    {event && (
                      <div className={`${event.color} h-full rounded-xl p-2 text-[10px] font-black shadow-sm flex flex-col justify-center animate-scale-in border border-white/10 group/item`}>
                        <div className="truncate mb-1">{event.title}</div>
                        <div className="opacity-70 font-normal uppercase tracking-tighter">
                          {event.type === 'study' ? 'AI Allocated' : 'Fixed'}
                        </div>
                        <button 
                          onClick={() => onDeleteEvent(event.id)}
                          className="absolute top-1 right-1 p-1 bg-black/20 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity hover:bg-black/40"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-8 py-4 bg-[#F5EBE0]/20 rounded-3xl border border-[#D5BDAF]/10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#4F4238]"></div>
          <span className="text-xs font-bold text-[#8E7D6F]">固定行程 / 忙碌中</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#A9927D]"></div>
          <span className="text-xs font-bold text-[#8E7D6F]">AI 智能分配時段</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border border-dashed border-[#D5BDAF] rounded-full"></div>
          <span className="text-xs font-bold text-[#8E7D6F]">點擊行程上的 X 可單獨刪除</span>
        </div>
      </div>
    </div>
  );
};

export default StatsView;
