
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
      className="bg-white rounded-[2rem] p-6 shadow-md border border-[#D5BDAF]/20 hover:shadow-xl transition-all cursor-pointer"
    >
      <div className="flex justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-[10px] text-white font-bold ${plan.color}`}>{plan.category}</span>
        <button onClick={(e) => { e.stopPropagation(); onDelete(plan.id); }} className="text-gray-300 hover:text-red-500"><Icons.Trash /></button>
      </div>
      <h3 className="text-xl font-bold mb-4">{plan.subject}</h3>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${plan.color} transition-all`} style={{ width: `${progress}%` }} />
      </div>
      <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400 uppercase">
        <span>Progress</span>
        <span>{progress}%</span>
      </div>
    </div>
  );
};

export default PlanCard;
