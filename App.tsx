
import React, { useState, useEffect } from 'react';
import { StudyPlan, ViewType, ProjectPlan } from './types.ts';
import { Icons } from './services/constants.tsx';
import PlanForm from './components/PlanForm.tsx';
import PlanCard from './components/PlanCard.tsx';
import PlanDetail from './components/PlanDetail.tsx';
import StatsView from './components/StatsView.tsx';
import ProjectView from './components/ProjectView.tsx';
import PomodoroTimer from './components/PomodoroTimer.tsx';
import { getStudyAdvice } from './services/geminiService.ts';

const App: React.FC = () => {
  const [plans, setPlans] = useState<StudyPlan[]>(() => {
    const saved = localStorage.getItem('study_plans_2026_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [projects, setProjects] = useState<ProjectPlan[]>(() => {
    const saved = localStorage.getItem('study_projects_2026');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeView, setActiveView] = useState<ViewType>('plans');
  const [showForm, setShowForm] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('study_plans_2026_v2', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('study_projects_2026', JSON.stringify(projects));
  }, [projects]);

  const handleAddPlan = async (newPlanData: Omit<StudyPlan, 'id'>) => {
    setIsLoading(true);
    setShowForm(false);
    
    const newId = crypto.randomUUID();
    const aiResult = await getStudyAdvice(newPlanData);
    
    const newPlan: StudyPlan = {
      ...newPlanData,
      id: newId,
      aiAdvice: `${aiResult.difficulty} 難度 - ${aiResult.suggestedPace}\n\n${aiResult.advice}`
    };

    setPlans(prev => [newPlan, ...prev]);
    setIsLoading(false);
  };

  const handleDeletePlan = (id: string) => {
    if (confirm('確定要刪除這個讀書計劃嗎？')) {
      setPlans(prev => prev.filter(p => p.id !== id));
      if (selectedPlanId === id) setSelectedPlanId(null);
    }
  };

  const handleToggleTask = (planId: string, taskDate: string) => {
    setPlans(prev => prev.map(plan => {
      if (plan.id === planId) {
        const updatedTasks = plan.tasks.map(task => 
          task.date === taskDate ? { ...task, isCompleted: !task.isCompleted } : task
        );
        const completedPages = updatedTasks
          .filter(t => t.isCompleted)
          .reduce((sum, t) => sum + t.pagesToRead, 0);
        
        return { ...plan, tasks: updatedTasks, completedPages };
      }
      return plan;
    }));
  };

  const handleAddMinutes = (planId: string, minutes: number) => {
    const today = new Date().toISOString().split('T')[0];
    setPlans(prev => prev.map(plan => {
      if (plan.id === planId) {
        const updatedTasks = plan.tasks.map(task => 
          task.date === today ? { ...task, minutesSpent: task.minutesSpent + minutes } : task
        );
        return { 
          ...plan, 
          tasks: updatedTasks, 
          totalMinutes: plan.totalMinutes + minutes 
        };
      }
      return plan;
    }));
  };

  const handlePomodoroComplete = (mins: number) => {
    if (plans.length === 0) return;
    const targetPlanId = selectedPlanId || plans[0].id;
    handleAddMinutes(targetPlanId, mins);
  };

  const selectedPlan = plans.find(p => p.id === selectedPlanId);

  return (
    <div className="min-h-screen pb-24 bg-[#FDF8F5] text-[#4F4238]">
      <header className="glass sticky top-0 z-40 px-6 py-4 flex justify-between items-center shadow-sm border-b border-[#D5BDAF]/20">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#A9927D] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#A9927D]/20">
            <Icons.Book />
          </div>
          <h1 className="text-xl font-black text-[#4F4238]">StudyFlow <span className="text-[#A9927D]">2026</span></h1>
        </div>

        <div className="flex bg-[#F5EBE0] p-1 rounded-2xl">
          <button onClick={() => setActiveView('plans')} className={`px-4 py-2 rounded-xl text-sm font-bold ${activeView === 'plans' ? 'bg-[#A9927D] text-white' : 'text-[#8E7D6F]'}`}>計劃</button>
          <button onClick={() => setActiveView('projects')} className={`px-4 py-2 rounded-xl text-sm font-bold ${activeView === 'projects' ? 'bg-[#A9927D] text-white' : 'text-[#8E7D6F]'}`}>專題</button>
          <button onClick={() => setActiveView('stats')} className={`px-4 py-2 rounded-xl text-sm font-bold ${activeView === 'stats' ? 'bg-[#A9927D] text-white' : 'text-[#8E7D6F]'}`}>數據</button>
        </div>

        <button onClick={() => setShowForm(true)} className="bg-[#A9927D] text-white px-4 py-2 rounded-2xl font-bold shadow-lg">+</button>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-10">
        {activeView === 'plans' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map(plan => (
              <PlanCard key={plan.id} plan={plan} onSelect={setSelectedPlanId} onDelete={handleDeletePlan} />
            ))}
            {plans.length === 0 && <div className="col-span-full text-center py-20 opacity-50">尚無計劃，請點擊右上角新增。</div>}
          </div>
        ) : activeView === 'stats' ? (
          <StatsView plans={plans} />
        ) : (
          <ProjectView projects={projects} onUpdateProjects={setProjects} />
        )}
      </main>

      <PomodoroTimer onSessionComplete={handlePomodoroComplete} isActiveSession={false} />
      {showForm && <PlanForm onSubmit={handleAddPlan} onCancel={() => setShowForm(false)} />}
      {selectedPlan && <PlanDetail plan={selectedPlan} onToggleTask={handleToggleTask} onClose={() => setSelectedPlanId(null)} onAddMinutes={(pid, date, mins) => handleAddMinutes(pid, mins)} />}
      {isLoading && <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center text-white">AI 分析中...</div>}
    </div>
  );
};

export default App;
