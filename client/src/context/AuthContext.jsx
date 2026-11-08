import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const ROLES = {
  PLATFORM_ADMIN: 'PLATFORM_ADMIN',
  ORGANISER: 'ORGANISER',
  AUCTIONEER: 'AUCTIONEER',
  TEAM_OWNER: 'TEAM_OWNER',
  BROADCAST_OPERATOR: 'BROADCAST_OPERATOR'
};

export const ROLE_LABELS = {
  [ROLES.PLATFORM_ADMIN]: 'Platform Administrator',
  [ROLES.ORGANISER]: 'Tournament Organiser',
  [ROLES.AUCTIONEER]: 'Auctioneer',
  [ROLES.TEAM_OWNER]: 'Team Owner / Bidder',
  [ROLES.BROADCAST_OPERATOR]: 'Broadcast Operator'
};

const DEFAULT_USER = {
  id: 'usr_lk_001',
  name: 'Kusal Mendis',
  email: 'kusal.admin@colombocricket.lk',
  phone: '+94 77 123 4567',
  role: ROLES.ORGANISER,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  organisation: {
    id: 'org_mca_01',
    name: 'Mercantile Cricket Association',
    slug: 'mca-srilanka',
    logo: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=100&auto=format&fit=crop&q=80',
    plan: 'PRO_SAAS'
  },
  activeTournament: {
    id: 'trn_2026_mca_a',
    name: 'MCA Premier League 2026',
    auctionType: 'MONEY',
    currency: 'LKR',
    status: 'AUCTION_LIVE'
  },
  assignedTeam: {
    id: 'tm_colombo_kings',
    name: 'Colombo Kings',
    shortCode: 'CK',
    purseRemaining: 3450000,
    purseTotal: 5000000
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(DEFAULT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Switch role helper for testing different role navigation configurations
  const switchRole = (newRole) => {
    setUser(prev => ({
      ...prev,
      role: newRole,
      name: newRole === ROLES.PLATFORM_ADMIN ? 'Dharshana Senanayake' :
            newRole === ROLES.AUCTIONEER ? 'Charu Sharma (Guest)' :
            newRole === ROLES.TEAM_OWNER ? 'Ranjan Madugalle (Owner)' :
            newRole === ROLES.BROADCAST_OPERATOR ? 'Thilina OBS Lead' : 'Kusal Mendis'
    }));
  };

  const login = (role = ROLES.ORGANISER) => {
    switchRole(role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      isAuthenticated,
      currentRole: user?.role || ROLES.ORGANISER,
      roleLabel: ROLE_LABELS[user?.role] || 'User',
      switchRole,
      login,
      logout,
      ROLES
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
