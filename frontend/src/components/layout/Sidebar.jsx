import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  BarChart3, 
  UserCog, 
  Briefcase, 
  Activity,
  ChevronLeft 
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isActive = (path) => location.pathname === path;
  
  // State for sidebar collapse
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Menu Configuration
  const staffItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Consultants', icon: Users, path: '/candidates' },
    { label: 'Submissions', icon: FileText, path: '/submissions' },
    { label: 'Availability', icon: Calendar, path: '/availability' },
    { label: 'Reports', icon: BarChart3, path: '/reports' },
  ];

  const candidateItems = [
    { label: 'My Jobs', icon: Briefcase, path: '/candidate/jobs' },
    { label: 'Tracker', icon: Activity, path: '/candidate/tracker' },
    { label: 'Resume', icon: FileText, path: '/candidate/resume' },
  ];

  const menuItems = user?.role === 'CANDIDATE' ? candidateItems : staffItems;

  return (
    <aside 
      className={cn(
        "bg-white border-r border-slate-100 h-screen sticky top-0 flex flex-col justify-between z-30 font-sans transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      
      {/* --- Top Section --- */}
      <div>
        {/* Header: Logo + Toggle Button */}
        <div className={cn(
          "h-16 flex items-center mb-4 transition-all duration-300",
          isCollapsed ? "justify-center px-0" : "justify-between px-6"
        )}>
          {/* Logo Area */}
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-slate-900 p-2 rounded-lg shrink-0">
              <Users className="h-5 w-5 text-white" />
            </div>
            {/* Hide text when collapsed */}
            <span className={cn(
              "text-xl font-bold text-slate-900 tracking-tight whitespace-nowrap transition-opacity duration-300",
              isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100"
            )}>
              CT
            </span>
          </div>

          {/* Toggle Button (The < arrow) */}
          {!isCollapsed && (
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* If collapsed, show the expand button centered at top if you prefer, 
            OR user can click the logo area to expand. 
            Here is a dedicated toggle when collapsed: */}
        {isCollapsed && (
          <div className="flex justify-center mb-4">
             <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500"
            >
              <ChevronLeft className="h-5 w-5 rotate-180" />
            </button>
          </div>
        )}

        {/* Menu Items */}
        <div className="px-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                isCollapsed ? "justify-center px-0" : "px-3 gap-3",
                isActive(item.path) 
                  ? "bg-slate-900 text-white shadow-md" // Active: Dark bg, White Icon
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive(item.path) ? "text-white" : "text-slate-400 group-hover:text-slate-900")} />
              
              {/* Text Label (Hidden on collapse) */}
              <span className={cn(
                "whitespace-nowrap transition-all duration-200",
                isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"
              )}>
                {item.label}
              </span>

              {/* Tooltip on Hover (When Collapsed) */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* --- Bottom Section (Admin User Management) --- */}
      <div className="p-3 pb-6">
        {user?.role === 'ADMIN' && (
          <>
            {!isCollapsed && (
              <div className="px-2 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                ADMIN
              </div>
            )}
            <Link to="/admin/users">
              <div 
                className={cn(
                  "flex items-center py-3 rounded-xl transition-all duration-200 cursor-pointer shadow-sm group relative",
                  isCollapsed ? "justify-center px-0 bg-transparent" : "px-4 gap-3 bg-slate-900 hover:bg-slate-800"
                )}
              >
                <div className={cn(
                  "shrink-0",
                  isCollapsed ? "bg-slate-900 p-2 rounded-lg text-white" : "text-white"
                )}>
                   <UserCog className="h-5 w-5" />
                </div>
                
                <span className={cn(
                  "font-semibold text-sm text-white whitespace-nowrap transition-all duration-200",
                  isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"
                )}>
                  User Management
                </span>

                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                    User Management
                  </div>
                )}
              </div>
            </Link>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;