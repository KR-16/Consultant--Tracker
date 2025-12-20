import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FileText, 
  UserCircle, 
  ClipboardList, 
  Bot,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  UserCog,
  PlusCircle,
  FolderKanban
} from 'lucide-react';
import { cn } from '../../lib/utils';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!user) return null;

  const menus = {
    admin: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'User Management', path: '/admin/users', icon: UserCog },
      { name: 'System Reports', path: '/reports', icon: BarChart3 },
      { name: 'Post Job', path: '/jobs/new', icon: PlusCircle },       
      { name: 'Submissions', path: '/submissions', icon: FileText },
      { name: 'Pipeline', path: '/pipeline', icon: FolderKanban }, 
    ],
    hiring_manager: [
      { name: 'Dashboard', path: '/hiring/dashboard', icon: LayoutDashboard },
      { name: 'My Candidates', path: '/hiring/my-candidates', icon: Users },
      { name: 'Post Job', path: '/jobs/new', icon: PlusCircle },       
      { name: 'Submissions', path: '/submissions', icon: FileText },
      { name: 'Pipeline', path: '/pipeline', icon: FolderKanban }, 
    ],
    candidate: [
      { name: 'Dashboard', path: '/candidate/dashboard', icon: LayoutDashboard },
      { name: 'Jobs', path: '/candidate/jobs', icon: Briefcase },
      { name: 'Applications', path: '/candidate/applications', icon: ClipboardList },
      { name: 'Profile', path: '/candidate/profile', icon: UserCircle },
      { name: 'Resume Builder', path: '/candidate/ai-resume', icon: Bot }, 
    ]
  };

  const role = user.role ? user.role.toLowerCase() : 'candidate';
  const currentMenu = menus[role] || menus['candidate'];
  
  const isActive = (path) => location.pathname === path;

  return (
    <aside 
      className={cn(
        "bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-slate-800 h-screen sticky top-0 flex flex-col justify-between transition-all duration-300 z-20",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      
      {/* --- Top Section --- */}
      <div>
        {/* Header */}
        <div className={cn(
          "h-16 flex items-center border-b border-gray-100 dark:border-slate-800 transition-all duration-300",
          isCollapsed ? "justify-center px-0" : "justify-between px-6"
        )}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-slate-900 dark:bg-white p-1.5 rounded-lg shrink-0">
                <Users className="h-5 w-5 text-white dark:text-slate-900" />
            </div>
            <span className={cn(
              "text-xl font-bold text-gray-900 dark:text-white tracking-tight whitespace-nowrap transition-all duration-300",
              isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100"
            )}>
              Talentra
            </span>
          </div>

          {!isCollapsed && (
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Toggle button for collapsed state */}
        {isCollapsed && (
          <div className="flex justify-center my-4">
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Menu Items */}
        <div className="px-3 py-4 space-y-1">
          {currentMenu.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center rounded-lg text-sm font-medium transition-all duration-200 group relative",
                  isCollapsed ? "justify-center py-3 px-0 mx-2" : "py-3 px-3 gap-3",
                  active 
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 border-l-4 border-blue-600 dark:border-blue-400"
                    : "text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white border-l-4 border-transparent"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  active 
                    ? "text-blue-600 dark:text-blue-300" 
                    : "text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300"
                )} />
                
                <span className={cn(
                  "whitespace-nowrap transition-all duration-200",
                  isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"
                )}>
                  {item.name}
                </span>

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;