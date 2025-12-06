import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, // Icon for Jobs
  Calendar, 
  FileText, // Icon for Resume
  Activity, // Icon for Tracker
  ArrowLeft, 
  UserCog 
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // --- MENU CONFIGURATION ---
  
  // Menu for ADMIN and TALENT_MANAGER
  const staffItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Consultants', icon: UserCog, path: '/candidates' },
    { label: 'Submissions', icon: FileText, path: '/submissions' },
    { label: 'Availability', icon: Calendar, path: '/availability' },
    { label: 'Reports', icon: Activity, path: '/reports' },
  ];

  // Menu specifically for CANDIDATE (As per your requirement)
  const candidateItems = [
    { label: 'Jobs', icon: Briefcase, path: '/candidate/jobs' },       // Shows their submissions
    { label: 'Tracker', icon: Activity, path: '/candidate/tracker' },  // Application Status Tracker
    { label: 'Calendar', icon: Calendar, path: '/availability' },      // Shared Availability Page
    { label: 'Resume', icon: FileText, path: '/candidate/resume' },    // Profile/Resume Edit
  ];

  // Decide which menu to show
  const menuItems = user?.role === 'CANDIDATE' ? candidateItems : staffItems;

  return (
    <aside className="w-64 bg-white border-r border-slate-100 min-h-screen hidden md:flex flex-col justify-between z-20 font-sans">
      
      {/* --- Top Section --- */}
      <div>
        <div className="pt-6 pb-4 px-6">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-2 rounded-lg">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">RecruitOps</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-4 mt-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200",
                isActive(item.path) 
                  ? "text-slate-900 font-bold bg-slate-50" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive(item.path) ? "text-slate-900" : "text-slate-400")} />
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* --- Bottom Section --- */}
      <div className="p-4 border-t border-slate-50">
        {/* Only Admin sees User Management */}
        {user?.role === 'ADMIN' && (
          <Link to="/admin/users" className="block mb-2">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer shadow-sm">
              <UserCog className="h-5 w-5" />
              <span className="font-semibold">User Management</span>
            </div>
          </Link>
        )}
        
        {/* Logout is handled in Navbar, but can be added here if needed. 
            Per your request, Profile/Logout is at top right. */}
      </div>
    </aside>
  );
};

export default Sidebar;