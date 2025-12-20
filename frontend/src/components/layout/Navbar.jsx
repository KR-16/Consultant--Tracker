import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell, ChevronDown } from 'lucide-react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { cn } from '../../lib/utils'; 

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(0);
  const [notificationList, setNotificationList] = useState([]);
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const mockNotifications = [
        { id: 1, message: 'New job posted: Senior React Developer', type: 'JOB_POSTED', read: false, createdAt: new Date() },
        { id: 2, message: 'Application status updated', type: 'STATUS_UPDATE', read: false, createdAt: new Date() },
        { id: 3, message: 'New candidate applied to your job', type: 'NEW_APPLICATION', read: true, createdAt: new Date() },
      ];
      
      const unreadCount = mockNotifications.filter(n => !n.read).length;
      setNotifications(unreadCount);
      setNotificationList(mockNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleDisplay = (role) => {
    switch(role) {
      case 'TALENT_MANAGER': return 'Talent Manager';
      case 'ADMIN': return 'Administrator';
      case 'CANDIDATE': return 'Candidate';
      default: return role?.toLowerCase() || 'User';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const markAsRead = async (notificationId) => {
    try {
      setNotifications(prev => Math.max(0, prev - 1));
      setNotificationList(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(0);
      setNotificationList(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.type === 'JOB_POSTED' && user?.role === 'CANDIDATE') {
      navigate('/candidate/jobs');
    } else if (notification.type === 'NEW_APPLICATION' && user?.role === 'TALENT_MANAGER') {
      navigate('/submissions');
    } else if (notification.type === 'STATUS_UPDATE') {
      navigate('/candidate/applications');
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-10">
      {/* Left: Page Title */}
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Welcome, {user?.first_name || user?.name || 'User'}
        </h1>
      </div>

      {/* Right: User Actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none relative">
            <button className="p-2 text-gray-500 dark:text-slate-400 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent 
            align="end" 
            className="w-80 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 shadow-lg max-h-96 overflow-y-auto"
          >
            <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
              {notifications > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            <div className="py-1">
              {notificationList.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500 dark:text-slate-400">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                notificationList.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      "px-4 py-3 cursor-pointer border-l-2 hover:bg-gray-50 dark:hover:bg-slate-800",
                      notification.read 
                        ? "border-transparent text-gray-600 dark:text-slate-400"
                        : "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 text-gray-900 dark:text-white"
                    )}
                  >
                    <div className="flex-1">
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                        {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                    )}
                  </DropdownMenuItem>
                ))
              )}
            </div>
            
            <div className="px-4 py-2 border-t border-gray-100 dark:border-slate-800 text-center">
              <button 
                onClick={() => navigate('/notifications')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View all notifications
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center border border-gray-200 dark:border-slate-700 cursor-pointer hover:opacity-90 transition-opacity">
              <span className="font-bold text-gray-700 dark:text-white text-sm">
                {getInitials(user?.first_name && user?.last_name 
                  ? `${user.first_name} ${user.last_name}`
                  : user?.name || 'User'
                )}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </DropdownMenuTrigger>
          
          <DropdownMenuContent 
            align="end" 
            className="w-56 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 shadow-lg"
          >
            {/* User Info Section */}
            <div className="px-3 py-2 border-b border-gray-100 dark:border-slate-800">
              <p className="font-medium text-gray-900 dark:text-white">
                {user?.first_name && user?.last_name 
                  ? `${user.first_name} ${user.last_name}`
                  : user?.name || 'User'
                }
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {getRoleDisplay(user?.role)}
              </p>
            </div>

            {/* Logout Only */}
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 px-3 py-2"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;