import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import MobileNav from './MobileNav';
import Breadcrumbs from './Breadcrumbs';
import NotificationDrawer from './NotificationDrawer';

export default function AppLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-crick-dark text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        closeMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        {/* Top Navbar */}
        <TopNav openMobile={() => setMobileSidebarOpen(true)} />

        {/* Dynamic Notification Drawer */}
        <NotificationDrawer />

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8 max-w-7xl w-full mx-auto">
          <Breadcrumbs />
          <Outlet />
        </main>

        {/* Mobile Touch Bar */}
        <MobileNav openDrawer={() => setMobileSidebarOpen(true)} />
      </div>
    </div>
  );
}
