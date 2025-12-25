
import React, { useState, useEffect } from 'react';
import { StudyPlan, ViewType, ProjectPlan } from './types';
import { Icons } from './services/constants';
import PlanForm from './components/PlanForm';
import PlanCard from './components/PlanCard';
import PlanDetail from './components/PlanDetail';
import StatsView from './components/StatsView';
import ProjectView from './components/ProjectView';
import PomodoroTimer from './components/PomodoroTimer';
import { getStudyAdvice } from './services/geminiService';

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

  const exportData = () => {
    const data = {
      plans,
      projects,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studyflow_backup_${new Date().toLocaleDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.plans && data.projects) {
          setPlans(data.plans);
          setProjects(data.projects);
          alert('資料匯入成功！');
        }
      } catch (err) {
        alert('無效的備份檔案');
      }
    };
    reader.readAsText(file);
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
          <div className="hidden lg:block">
            <h1 className="text-xl font-black text-[#4F4238] tracking-tight">StudyFlow <span className="text-[#A9927D]">2026</span></h1>
            <p className="text-[10px] font-bold text-[#8E7D6F] uppercase tracking-widest">Milk Tea Aesthetic</p>
          </div>
        </div>

        <div className="flex bg-[#F5EBE0] p-1 rounded-2xl border border-[#D5BDAF]/30 overflow-x-auto max-w-[50%] md:max-w-none no-scrollbar">
          <button 
            onClick={() => setActiveView('plans')}
            className={`whitespace-nowrap px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${activeView === 'plans' ? 'bg-[#A9927D] shadow-md text-white' : 'text-[#8E7D6F] hover:text-[#4F4238]'}`}
          >
            我的計劃
          </button>
          <button 
            onClick={() => setActiveView('projects')}
            className={`whitespace-nowrap px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${activeView === 'projects' ? 'bg-[#A9927D] shadow-md text-white' : 'text-[#8E7D6F] hover:text-[#4F4238]'}`}
          >
            專題計劃
          </button>
          <button 
            onClick={() => setActiveView('stats')}
            className={`whitespace-nowrap px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${activeView === 'stats' ? 'bg-[#A9927D] shadow-md text-white' : 'text-[#8E7D6F] hover:text-[#4F4238]'}`}
          >
            數據統計
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 mr-2 px-2 border-r border-[#D5BDAF]/30">
            <button onClick={exportData} title="匯出備份" className="p-2 text-[#A9927D] hover:bg-[#F5EBE0] rounded-xl transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </button>
            <label title="匯入備份" className="p-2 text-[#A9927D] hover:bg-[#F5EBE0] rounded-xl transition-colors cursor-pointer">
              <input type="file" accept=".json" onChange={importData} className="hidden" />
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </label>
          </div>
          
          <button 
            onClick={() => setShowForm(true)}
            className="bg-[#A9927D] hover:bg-[#8E7D6F] text-white px-4 py-2 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-[#A9927D]/30 transition-all active:scale-95 text-xs md:text-sm"
          >
            <Icons.Plus /> <span className="hidden sm:inline">新增</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-10">
        {activeView === 'plans' ? (
          <div className="animate-fade-in">
            <div className="mb-12 text-center md:text-left">
              <h2 className="text-4xl font-extrabold text-[#4F4238] mb-3">溫柔對待學習的每一天</h2>
              <p className="text-[#8E7D6F] font-medium italic">目前正在進行 {plans.length} 項精采的學習探索</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {plans.map(plan => (
                <PlanCard key={plan.id} plan={plan} onSelect={setSelectedPlanId} onDelete={handleDeletePlan} />
              ))}
              {plans.length === 0 && (
                <div className="col-span-full py-28 flex flex-col items-center justify-center border-2 border-dashed border-[#D5BDAF] rounded-[2rem] bg-white/40">
                  <div className="w-20 h-20 bg-[#F5EBE0] rounded-full flex items-center justify-center text-[#A9927D] mb-6"><Icons.Book /></div>
                  <p className="text-[#8E7D6F] font-bold text-lg">安靜的書桌，正等待您的第一個計劃</p>
                  <button onClick={() => setShowForm(true)} className="mt-6 bg-[#A9927D] text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-[#8E7D6F] transition-all">立即開始</button>
                </div>
              )}
            </div>
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

      {isLoading && (
        <div className="fixed inset-0 bg-[#4F4238]/60 backdrop-blur-md z-[60] flex flex-col items-center justify-center text-[#FDF8F5]">
          <div className="w-16 h-16 border-4 border-[#D5BDAF]/30 border-t-[#D5BDAF] rounded-full animate-spin mb-6"></div>
          <p className="font-bold text-xl animate-pulse tracking-widest px-6 text-center">AI 教練正在泡一杯咖啡，為您整理思緒...</p>
        </div>
      )}
    </div>
  );
};

export default App;
