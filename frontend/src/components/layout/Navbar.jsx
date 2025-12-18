import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon } from 'lucide-react'; 
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const isCandidate = user?.role === 'CANDIDATE';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="h-16 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-10 transition-colors duration-300">
      
      {/* Left Spacer / Branding Area */}
      <div className="md:hidden">
         <span className="font-bold text-lg text-slate-900 dark:text-white">CT</span>
      </div>
      <div className="hidden md:block flex-1" />

      {/* Right: User Profile Dropdown */}
      <div className="flex items-center gap-4">
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
              {user?.role === 'TALENT_MANAGER' ? 'Talent Manager' : user?.role?.toLowerCase()}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                 <span className="font-bold text-slate-600 dark:text-slate-300 text-lg">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                 </span>
              </div>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              {isCandidate && (
                <>
                  {/* ✅ Correct Link to Profile */}
                  <DropdownMenuItem 
                    onClick={() => navigate('/candidate/profile')}
                    className="cursor-pointer dark:text-slate-200 dark:focus:bg-slate-800"
                  >
                    <UserIcon className="w-4 h-4 mr-2" />
                    My Profile
                  </DropdownMenuItem>
                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                </>
              )}
              
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/10 cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;