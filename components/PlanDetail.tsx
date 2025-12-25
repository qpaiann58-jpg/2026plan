
import React from 'react';
import { StudyPlan } from '../types.ts';
import { Icons } from '../services/constants.tsx';

interface PlanDetailProps {
  plan: StudyPlan;
  onToggleTask: (planId: string, taskDate: string) => void;
  onClose: () => void;
  onAddMinutes: (planId: string, taskDate: string, mins: number) => void;
}

const PlanDetail: React.FC<PlanDetailProps> = ({ plan, onToggleTask, onClose, onAddMinutes }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
        <div className={`p-8 text-white ${plan.color} flex justify-between items-center`}>
          <h2 className="text-2xl font-bold">{plan.subject}</h2>
          <button onClick={onClose} className="p-2 bg-white/20 rounded-full">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-4">
          {plan.tasks.map((task, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border rounded-2xl bg-gray-50">
              <div>
                <div className="font-bold text-sm">{task.date}</div>
                <div className="text-xs text-gray-500">目標：{task.pagesToRead} 頁</div>
              </div>
              <button 
                onClick={() => onToggleTask(plan.id, task.date)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${task.isCompleted ? 'bg-green-500 text-white' : 'border-2 border-gray-200 text-gray-200'}`}
              >
                <Icons.Check />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanDetail;
