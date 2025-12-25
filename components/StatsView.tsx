
import React from 'react';
import { StudyPlan } from '../types';
import { Icons } from '../services/constants';

interface StatsViewProps {
  plans: StudyPlan[];
}

const StatsView: React.FC<StatsViewProps> = ({ plans }) => {
  const getDailyMinutes = () => {
    const daily: Record<string, number> = {};
    const today = new Date();
    
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      daily[key] = 0;
    }

    plans.forEach(plan => {
      plan.tasks.forEach(task => {
        if (daily[task.date] !== undefined) {
          daily[task.date] += task.minutesSpent;
        }
      });
    });

    return Object.entries(daily).sort((a, b) => a[0].localeCompare(b[0]));
  };

  const stats = getDailyMinutes();
  const maxMinutes = Math.max(...stats.map(s => s[1]), 60);
  const totalWeekMinutes = stats.reduce((sum, s) => sum + s[1], 0);

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-10">
      <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-10 shadow-sm border border-[#D5BDAF]/30">
        <h2 className="text-3xl font-black text-[#4F4238] mb-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#F5EBE0] text-[#A9927D] rounded-2xl flex items-center justify-center shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
          </div>
          本週專注報表
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          <div className="bg-[#F5EBE0] p-7 rounded-[2rem] shadow-sm border border-[#D5BDAF]/20 group hover:scale-105 transition-transform">
            <div className="text-[#8E7D6F] text-[10px] font-black uppercase tracking-widest mb-2">Weekly Focus</div>
            <div className="text-4xl font-black text-[#4F4238]">{Math.floor(totalWeekMinutes / 60)}h {totalWeekMinutes % 60}m</div>
          </div>
          <div className="bg-[#FDF8F5] p-7 rounded-[2rem] shadow-sm border border-[#D5BDAF]/20 group hover:scale-105 transition-transform">
            <div className="text-[#8E7D6F] text-[10px] font-black uppercase tracking-widest mb-2">Daily Average</div>
            <div className="text-4xl font-black text-[#4F4238]">{Math.floor(totalWeekMinutes / 7)}m</div>
          </div>
          <div className="bg-[#4F4238] p-7 rounded-[2rem] shadow-sm text-white group hover:scale-105 transition-transform">
            <div className="text-[#D5BDAF] text-[10px] font-black uppercase tracking-widest mb-2">Active Subjects</div>
            <div className="text-4xl font-black">{plans.filter(p => p.totalMinutes > 0).length}</div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-end px-2">
            <h3 className="font-black text-[#4F4238] text-lg">專注趨勢圖</h3>
            <span className="text-[10px] text-[#A9927D] font-black uppercase tracking-widest">MINUTES PER DAY</span>
          </div>
          <div className="h-60 flex items-end justify-between gap-4 px-4 pb-4">
            {stats.map(([date, mins]) => {
              const dayName = new Date(date).toLocaleDateString('zh-TW', { weekday: 'short' });
              const height = (mins / maxMinutes) * 100;
              return (
                <div key={date} className="flex-1 flex flex-col items-center gap-3 group relative h-full justify-end">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#4F4238] text-white text-[10px] font-black px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-20 shadow-xl scale-90 group-hover:scale-100 -translate-y-2 group-hover:translate-y-0">
                    {mins} MINS
                  </div>
                  <div 
                    className="w-full bg-[#A9927D] rounded-2xl transition-all duration-1000 ease-out hover:bg-[#8E7D6F] shadow-lg shadow-[#A9927D]/20 group-hover:shadow-xl"
                    style={{ height: `${Math.max(height, 8)}%` }}
                  >
                  </div>
                  <span className="text-[11px] text-[#8E7D6F] font-black uppercase tracking-tighter">{dayName}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map(plan => {
          const planWeekMins = plan.tasks
            .filter(t => stats.find(s => s[0] === t.date))
            .reduce((sum, t) => sum + t.minutesSpent, 0);
          
          return (
            <div key={plan.id} className="bg-white/50 p-8 rounded-[2rem] border border-[#D5BDAF]/20 flex items-center justify-between hover:shadow-lg transition-all group">
              <div>
                <div className={`text-[10px] font-black text-white px-3 py-1 rounded-full inline-block mb-3 shadow-sm ${plan.color}`}>
                  {plan.category}
                </div>
                <h4 className="text-xl font-black text-[#4F4238] group-hover:text-[#A9927D] transition-colors">{plan.subject}</h4>
                <p className="text-[11px] text-[#8E7D6F] font-bold mt-1">本週投入：{planWeekMins} 分鐘</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-[#4F4238]">{Math.round((plan.completedPages / plan.totalPages) * 100)}%</div>
                <div className="text-[10px] text-[#A9927D] font-black uppercase tracking-tighter mt-1">TOTAL PROGRESS</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatsView;
