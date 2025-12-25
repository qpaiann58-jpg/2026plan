
import React from 'react';
import { StudyPlan } from '../types.ts';
import { Icons } from '../services/constants.tsx';

interface PlanCardProps {
  plan: StudyPlan;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onSelect, onDelete }) => {
  const progress = Math.round((plan.completedPages / plan.totalPages) * 100);

  return (
    <div 
      onClick={() => onSelect(plan.id)}
      className="group bg-white/70 rounded-[2rem] p-7 shadow-sm border border-[#D5BDAF]/30 hover:shadow-2xl hover:-translate-y-1.5 transition-all cursor-pointer relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#D5BDAF]/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white ${plan.color} shadow-sm`}>
            {plan.category}
          </span>
          <h3 className="text-xl font-extrabold text-[#4F4238] mt-3 line-clamp-1 group-hover:text-[#A9927D] transition-colors">{plan.subject}</h3>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(plan.id); }}
          className="p-2.5 text-[#D5BDAF] hover:text-[#4F4238] transition-colors rounded-2xl hover:bg-[#F5EBE0]"
        >
          <Icons.Trash />
        </button>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex justify-between text-xs text-[#8E7D6F] font-medium">
          <span className="flex items-center gap-2 bg-[#FDF8F5] px-2 py-1 rounded-lg border border-[#D5BDAF]/20"><Icons.Calendar /> {plan.startDate} ~ {plan.endDate}</span>
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-end">
            <span className="text-sm font-black text-[#4F4238]">{progress}% <span className="text-[10px] text-[#8E7D6F] font-normal ml-1 uppercase tracking-tighter">Progress</span></span>
            <span className="text-[10px] font-bold text-[#D5BDAF] uppercase">{plan.completedPages} / {plan.totalPages} PAGES</span>
          </div>
          <div className="h-3 bg-[#F5EBE0] rounded-full overflow-hidden p-0.5 border border-[#D5BDAF]/10">
            <div 
              className={`h-full ${plan.color} rounded-full transition-all duration-700 ease-out`} 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {plan.aiAdvice && (
        <div className="mt-6 pt-4 border-t border-[#F5EBE0] flex items-center gap-3 relative z-10">
          <div className="w-8 h-8 rounded-2xl bg-[#F5EBE0] flex items-center justify-center text-[#A9927D]">
            <Icons.Sparkles />
          </div>
          <span className="text-[11px] text-[#8E7D6F] font-bold italic line-clamp-1">AI 已為您定制專屬策略</span>
        </div>
      )}
    </div>
  );
};

export default PlanCard;
