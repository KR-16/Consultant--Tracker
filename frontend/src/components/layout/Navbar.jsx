import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut } from 'lucide-react';
import { Input } from '../ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'ADMIN';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 z-10">
      
      {/* Left: Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search..." 
            className="pl-10 bg-transparent border-none focus-visible:ring-0 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right: Profile Area */}
      <div className="flex items-center gap-4">
        
        {/* User Profile Dropdown */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500 capitalize">
              {user?.role === 'TALENT_MANAGER' ? 'Talent Manager' : user?.role?.toLowerCase()}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors">
                 <span className="font-bold text-slate-600 text-lg">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                 </span>
              </div>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-48">
              {/* Only show "Profile" & "Settings" if NOT Admin (as per request) */}
              {!isAdmin && (
                <>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Settings
                  </DropdownMenuItem>
                  <div className="h-px bg-slate-100 my-1" />
                </>
              )}
              
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
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