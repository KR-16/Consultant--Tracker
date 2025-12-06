import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar (Width is handled internally by Sidebar component state) */}
      <Sidebar />

      {/* Main Content (Will automatically fill remaining width) */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
        <Navbar />
        
        <main className="flex-1 p-8 overflow-auto">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default Layout;