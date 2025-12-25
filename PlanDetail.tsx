
import React from 'react';
import { StudyPlan } from '../types';
import { Icons } from '../services/constants';

interface PlanDetailProps {
  plan: StudyPlan;
  onToggleTask: (planId: string, taskDate: string) => void;
  onClose: () => void;
  onAddMinutes: (planId: string, taskDate: string, mins: number) => void;
}

const PlanDetail: React.FC<PlanDetailProps> = ({ plan, onToggleTask, onClose, onAddMinutes }) => {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-[#4F4238]/70 backdrop-blur-md z-50 flex items-end md:items-center justify-center p-0 md:p-6">
      <div className="bg-[#FDF8F5] rounded-t-[3rem] md:rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col animate-fade-in border border-[#D5BDAF]/30">
        <div className={`p-8 text-white ${plan.color} flex justify-between items-start relative overflow-hidden`}>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs><pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#fff"/></pattern></defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>
          <div className="relative z-10">
            <div className="flex gap-2 items-center">
              <span className="bg-white/30 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">{plan.category}</span>
              <span className="bg-black/20 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">每週 {plan.frequencyPerWeek} 天</span>
            </div>
            <h2 className="text-3xl font-black mt-4 tracking-tight">{plan.subject}</h2>
            <div className="flex flex-wrap gap-4 mt-4">
              <p className="bg-black/10 px-3 py-1.5 rounded-xl text-white/90 text-[11px] font-bold flex items-center gap-2"><Icons.Calendar /> {plan.startDate} ~ {plan.endDate}</p>
              <p className="bg-black/10 px-3 py-1.5 rounded-xl text-white/90 text-[11px] font-bold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                累計專注：{plan.totalMinutes} 分鐘
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white/20 hover:bg-white/40 rounded-full transition-all relative z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {plan.aiAdvice && (
            <div className="mb-10 p-6 bg-white rounded-3xl border border-[#D5BDAF]/30 shadow-sm relative">
               <div className="absolute -top-3 left-6 bg-[#A9927D] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-md">
                <Icons.Sparkles /> AI COACH ADVICE
              </div>
              <p className="text-[#4F4238] text-sm leading-relaxed whitespace-pre-wrap font-medium">{plan.aiAdvice}</p>
            </div>
          )}

          <div className="space-y-6">
            <h3 className="font-black text-[#4F4238] flex items-center gap-3 text-lg">
              <div className="w-8 h-8 rounded-xl bg-[#F5EBE0] flex items-center justify-center text-[#A9927D]">
                <Icons.Book />
              </div>
              讀書排程清單
            </h3>
            
            <div className="space-y-3">
              {plan.tasks.map((task, idx) => {
                const isToday = task.date === today;
                const isRestDay = task.isRestDay;

                return (
                  <div 
                    key={task.date}
                    className={`flex items-center justify-between p-5 rounded-[1.5rem] border transition-all ${
                      isRestDay 
                        ? 'bg-[#FDF8F5] border-dashed border-[#D5BDAF]/40 opacity-60' 
                        : task.isCompleted 
                          ? 'bg-[#F5EBE0]/40 border-[#D5BDAF]/20' 
                          : isToday 
                            ? 'bg-white border-[#A9927D] shadow-xl shadow-[#A9927D]/10 ring-2 ring-[#A9927D]/10' 
                            : 'bg-white border-[#D5BDAF]/20 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black shadow-sm ${
                        isRestDay ? 'bg-slate-100 text-slate-300' : task.isCompleted ? 'bg-[#D5BDAF] text-white' : isToday ? 'bg-[#A9927D] text-white' : 'bg-[#FDF8F5] text-[#8E7D6F] border border-[#D5BDAF]/30'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <div className={`text-sm font-black tracking-tight ${task.isCompleted ? 'text-[#8E7D6F] line-through decoration-2' : 'text-[#4F4238]'}`}>
                          {task.date} 
                          {isToday && <span className="ml-3 text-[10px] bg-[#A9927D] text-white px-2 py-0.5 rounded-lg uppercase font-black">Today</span>}
                          {isRestDay && <span className="ml-3 text-[10px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded-lg uppercase font-black">Rest</span>}
                        </div>
                        {!isRestDay ? (
                          <div className="flex gap-4 mt-1.5">
                            <div className="text-[11px] text-[#8E7D6F] font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D5BDAF]"></span> 研讀：{task.pagesToRead} 頁
                            </div>
                            <div className="text-[11px] text-[#A9927D] font-black flex items-center gap-1">
                               <span className="w-1.5 h-1.5 rounded-full bg-[#A9927D] animate-pulse"></span> 專注：{task.minutesSpent} 分鐘
                            </div>
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 italic mt-1.5">今日休息，充電是為了走更長遠的路</div>
                        )}
                      </div>
                    </div>
                    
                    {!isRestDay && (
                      <button
                        onClick={() => onToggleTask(plan.id, task.date)}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md group ${
                          task.isCompleted 
                            ? 'bg-[#A9927D] text-white' 
                            : 'bg-[#FDF8F5] border-2 border-[#D5BDAF]/40 text-[#D5BDAF] hover:bg-[#A9927D] hover:text-white hover:border-transparent'
                        }`}
                      >
                        <Icons.Check />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetail;
