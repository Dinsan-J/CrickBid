import React, { useState } from 'react';
import { X, CheckCheck, MessageSquare, Gavel, Radio, Bell } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export default function NotificationDrawer() {
  const { notifications, unreadCount, isOpen, closeDrawer, markAsRead, markAllAsRead } = useNotifications();
  const [filterTab, setFilterTab] = useState('ALL');

  if (!isOpen) return null;

  const filtered = notifications.filter(n => {
    if (filterTab === 'ALL') return true;
    return n.type === filterTab;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'WHATSAPP':
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case 'BIDS':
        return <Gavel className="w-4 h-4 text-amber-400" />;
      case 'SYSTEM':
      default:
        return <Radio className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-crick-navy border-l border-slate-200 dark:border-crick-border shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-crick-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-crick-lime/10 text-crick-lime">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Platform Notifications
                </h3>
                <span className="text-xs text-slate-500 dark:text-crick-textMuted">
                  {unreadCount} unread alerts
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-crick-textMuted dark:hover:text-white hover:bg-slate-100 dark:hover:bg-crick-surface flex items-center gap-1"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4 text-crick-lime" />
                  <span className="hidden sm:inline">Mark read</span>
                </button>
              )}
              <button
                onClick={closeDrawer}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-crick-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-crick-surface/50 border-b border-slate-200 dark:border-crick-border flex items-center gap-2 overflow-x-auto">
            {['ALL', 'WHATSAPP', 'BIDS', 'SYSTEM'].map(tab => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterTab === tab
                    ? 'bg-crick-lime text-crick-dark shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-crick-surface'
                }`}
              >
                {tab === 'WHATSAPP' ? 'WhatsApp Alerts' : tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    item.read
                      ? 'bg-slate-50 dark:bg-crick-card/60 border-slate-200 dark:border-crick-border/60 opacity-80'
                      : 'bg-white dark:bg-crick-card border-slate-300 dark:border-crick-borderLight shadow-sm ring-1 ring-crick-lime/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-crick-surface">
                        {getIcon(item.type)}
                      </div>
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-100">
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 dark:text-crick-textMuted font-mono">
                        {item.timestamp}
                      </span>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-crick-lime" />
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 ml-8 leading-relaxed">
                    {item.message}
                  </p>

                  {item.phone && (
                    <div className="ml-8 mt-2">
                      <Badge variant="lime" size="sm">
                        SMS/WA: {item.phone}
                      </Badge>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-400 dark:text-crick-textMuted text-xs">
                No notifications in this category.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
