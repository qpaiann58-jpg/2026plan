
import React, { useState } from 'react';
import { ProjectPlan, ProjectCategory, ProjectTask } from '../types.ts';
import { Icons } from '../services/constants.tsx';

interface ProjectViewProps {
  projects: ProjectPlan[];
  onUpdateProjects: (projects: ProjectPlan[]) => void;
}

const ProjectView: React.FC<ProjectViewProps> = ({ projects, onUpdateProjects }) => {
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(projects[0]?.id || null);

  const addProject = () => {
    if (!newProjectTitle.trim()) return;
    const newProject: ProjectPlan = {
      id: crypto.randomUUID(),
      title: newProjectTitle,
      categories: []
    };
    onUpdateProjects([newProject, ...projects]);
    setNewProjectTitle('');
    setActiveProjectId(newProject.id);
  };

  const addCategory = (projectId: string) => {
    const categoryName = prompt('輸入類別名稱 (例如：第一階段、資料蒐集)：');
    if (!categoryName) return;
    
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          categories: [...p.categories, { id: crypto.randomUUID(), name: categoryName, tasks: [] }]
        };
      }
      return p;
    });
    onUpdateProjects(updatedProjects);
  };

  const addTask = (projectId: string, categoryId: string) => {
    const taskName = prompt('輸入任務名稱：');
    if (!taskName) return;
    const deadline = prompt('輸入截止日期 (YYYY-MM-DD)：', new Date().toISOString().split('T')[0]);
    if (!deadline) return;

    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          categories: p.categories.map(c => {
            if (c.id === categoryId) {
              return {
                ...c,
                tasks: [...c.tasks, { id: crypto.randomUUID(), name: taskName, deadline, isCompleted: false }]
              };
            }
            return c;
          })
        };
      }
      return p;
    });
    onUpdateProjects(updatedProjects);
  };

  const toggleTask = (projectId: string, categoryId: string, taskId: string) => {
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          categories: p.categories.map(c => {
            if (c.id === categoryId) {
              return {
                ...c,
                tasks: c.tasks.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t)
              };
            }
            return c;
          })
        };
      }
      return p;
    });
    onUpdateProjects(updatedProjects);
  };

  const deleteProject = (id: string) => {
    if (confirm('確定要刪除整個專題嗎？')) {
      onUpdateProjects(projects.filter(p => p.id !== id));
      setActiveProjectId(null);
    }
  };

  const activeProject = projects.find(p => p.id === activeProjectId);

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 space-y-4">
          <div className="bg-white/60 p-4 rounded-3xl border border-[#D5BDAF]/30 shadow-sm">
            <h3 className="text-xs font-black text-[#8E7D6F] uppercase tracking-widest mb-4 px-2">我的所有專題</h3>
            <div className="space-y-2">
              {projects.map(p => (
                <button
                  key={p.id}
                  onClick={() => setActiveProjectId(p.id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all flex justify-between items-center group ${activeProjectId === p.id ? 'bg-[#A9927D] text-white shadow-md' : 'text-[#4F4238] hover:bg-[#F5EBE0]'}`}
                >
                  <span className="truncate">{p.title}</span>
                  <div onClick={(e) => { e.stopPropagation(); deleteProject(p.id); }} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-400">
                    <Icons.Trash />
                  </div>
                </button>
              ))}
              <div className="pt-2">
                <input
                  type="text"
                  placeholder="新專題名稱..."
                  className="w-full px-4 py-2 rounded-xl border border-[#D5BDAF]/30 bg-white/50 text-xs focus:ring-1 focus:ring-[#A9927D] outline-none"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addProject()}
                />
                <button onClick={addProject} className="w-full mt-2 py-2 bg-[#F5EBE0] text-[#A9927D] rounded-xl text-xs font-bold hover:bg-[#D5BDAF] hover:text-white transition-all">
                  + 建立專題
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          {activeProject ? (
            <div className="bg-white/60 p-8 rounded-[2.5rem] border border-[#D5BDAF]/30 shadow-sm space-y-8">
              <div className="flex justify-between items-center border-b border-[#D5BDAF]/10 pb-6">
                <div>
                  <h2 className="text-3xl font-black text-[#4F4238]">{activeProject.title}</h2>
                  <p className="text-[#8E7D6F] text-xs font-bold uppercase tracking-widest mt-1">Project Roadmap</p>
                </div>
                <button
                  onClick={() => addCategory(activeProject.id)}
                  className="bg-[#A9927D] text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-lg hover:bg-[#8E7D6F] transition-all flex items-center gap-2"
                >
                  <Icons.Plus /> 新增類別
                </button>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {activeProject.categories.map(category => (
                  <div key={category.id} className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                      <h4 className="text-lg font-black text-[#4F4238] flex items-center gap-2">
                        <span className="w-2 h-6 bg-[#A9927D] rounded-full"></span>
                        {category.name}
                      </h4>
                      <button
                        onClick={() => addTask(activeProject.id, category.id)}
                        className="text-[10px] font-black text-[#A9927D] uppercase tracking-widest hover:underline"
                      >
                        + 新增細項任務
                      </button>
                    </div>

                    <div className="space-y-3">
                      {category.tasks.length === 0 && (
                        <div className="p-8 border-2 border-dashed border-[#D5BDAF]/20 rounded-3xl text-center text-slate-300 text-xs">
                          此類別尚無任務
                        </div>
                      )}
                      {category.tasks.map(task => (
                        <div
                          key={task.id}
                          className={`flex items-center justify-between p-5 rounded-[1.5rem] border transition-all ${task.isCompleted ? 'bg-[#F5EBE0]/40 border-[#D5BDAF]/10' : 'bg-white border-[#D5BDAF]/20 shadow-sm'}`}
                        >
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => toggleTask(activeProject.id, category.id, task.id)}
                              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-sm ${task.isCompleted ? 'bg-[#A9927D] text-white' : 'bg-[#FDF8F5] border-2 border-[#D5BDAF]/30 text-[#D5BDAF] hover:bg-[#A9927D] hover:text-white'}`}
                            >
                              <Icons.Check />
                            </button>
                            <div>
                              <div className={`text-sm font-black ${task.isCompleted ? 'text-[#8E7D6F] line-through decoration-2' : 'text-[#4F4238]'}`}>
                                {task.name}
                              </div>
                              <div className="text-[10px] text-[#A9927D] font-bold mt-1 flex items-center gap-1">
                                <Icons.Calendar /> 截止日：{task.deadline}
                              </div>
                            </div>
                          </div>
                          {task.isCompleted && (
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg">Done</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-[#D5BDAF]/30 rounded-[2.5rem] bg-white/30 p-10 text-center">
              <div className="w-16 h-16 bg-[#F5EBE0] rounded-full flex items-center justify-center text-[#A9927D] mb-6 shadow-inner">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </div>
              <h3 className="text-xl font-black text-[#4F4238]">選擇或建立一個專題</h3>
              <p className="text-[#8E7D6F] text-sm mt-2">將複雜的專題拆解成不同類別與細項，逐步攻克</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectView;
