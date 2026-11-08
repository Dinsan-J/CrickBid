import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_001',
    type: 'WHATSAPP',
    title: 'WhatsApp Alert Delivered',
    message: 'Wanindu Hasaranga was notified: Sold to Colombo Kings for LKR 850,000.',
    timestamp: '2 mins ago',
    read: false,
    phone: '+94 77 987 6543'
  },
  {
    id: 'notif_002',
    type: 'BIDS',
    title: 'New Highest Bid',
    message: 'Kandy Warriors raised bid to LKR 720,000 for Pathum Nissanka.',
    timestamp: '5 mins ago',
    read: false,
    team: 'Kandy Warriors'
  },
  {
    id: 'notif_003',
    type: 'SYSTEM',
    title: 'OBS Overlay Connected',
    message: 'OBS Studio browser source connected with stream key obs_live_mca2026.',
    timestamp: '18 mins ago',
    read: true
  },
  {
    id: 'notif_004',
    type: 'WHATSAPP',
    title: 'New Player Opt-In Consent',
    message: 'Charith Asalanka consented to WhatsApp notifications (+94 71 234 5678).',
    timestamp: '42 mins ago',
    read: true,
    phone: '+94 71 234 5678'
  },
  {
    id: 'notif_005',
    type: 'BIDS',
    title: 'Hammer Fall: Sold',
    message: 'Lot #14 Kamindu Mendis sold to Galle Titans for LKR 620,000.',
    timestamp: '1 hour ago',
    read: true
  }
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleDrawer = () => setIsOpen(prev => !prev);
  const closeDrawer = () => setIsOpen(false);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      isOpen,
      toggleDrawer,
      closeDrawer,
      markAsRead,
      markAllAsRead
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
