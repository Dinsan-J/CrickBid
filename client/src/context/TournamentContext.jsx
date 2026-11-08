import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { tournamentApi } from '../services/api';
import { useAuth, ROLES } from './AuthContext';

const TournamentContext = createContext();

export function TournamentProvider({ children }) {
  const { currentRole } = useAuth();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [resetPrompt, setResetPrompt] = useState(null); // stores { targetFormat } if locked

  const fetchTournament = useCallback(async () => {
    try {
      setLoading(true);
      const res = await tournamentApi.getActive();
      if (res.success && res.data) {
        setTournament(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch active tournament from backend:', err.message);
      // Fallback local defaults if server temporarily unreachable
      setTournament({
        _id: 'default_trn',
        name: 'MCA Premier League 2026',
        auctionType: 'MONEY',
        currencyCode: 'LKR',
        hasStartedBidding: false,
        startingPurse: 10000000,
        purseDisplay: 'LKR 10,000,000'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTournament();
  }, [fetchTournament]);

  // Format switcher with role-based checks and bidding-lock enforcement
  const switchFormat = async (targetFormat, explicitReset = false) => {
    if (!tournament) return;

    // 1. Client-side role validation
    const isAuthorized = [ROLES.PLATFORM_ADMIN, ROLES.ORGANISER].includes(currentRole);
    if (!isAuthorized) {
      throw new Error('Permission denied: Only Tournament Organisers or Platform Administrators can modify tournament auction format.');
    }

    if (tournament.auctionType === targetFormat && !explicitReset) {
      return; // Already selected
    }

    // 2. Check if locked due to bidding
    if (tournament.hasStartedBidding && !explicitReset) {
      // Trigger reset prompt workflow
      setResetPrompt({ targetFormat });
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const res = await tournamentApi.updateFormat(
        tournament._id,
        targetFormat,
        currentRole,
        explicitReset
      );

      if (res.success && res.data) {
        setTournament(prev => ({
          ...prev,
          ...res.data,
          hasStartedBidding: explicitReset ? false : prev.hasStartedBidding
        }));
        setResetPrompt(null);
      }
    } catch (err) {
      if (err.isLocked) {
        setResetPrompt({ targetFormat });
      }
      setError(err.message);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmResetAndSwitch = async () => {
    if (resetPrompt?.targetFormat) {
      await switchFormat(resetPrompt.targetFormat, true);
    }
  };

  const cancelResetPrompt = () => {
    setResetPrompt(null);
  };

  const toggleBiddingLock = async (newState) => {
    if (!tournament?._id) return;
    try {
      const res = await tournamentApi.toggleBidding(tournament._id, newState);
      if (res.success) {
        setTournament(prev => ({ ...prev, hasStartedBidding: newState }));
      }
    } catch (err) {
      console.error('Failed to toggle bidding lock:', err);
    }
  };

  return (
    <TournamentContext.Provider
      value={{
        tournament,
        loading,
        isUpdating,
        error,
        format: tournament?.auctionType || 'MONEY',
        currencyCode: tournament?.currencyCode || 'LKR',
        hasStartedBidding: Boolean(tournament?.hasStartedBidding),
        resetPrompt,
        switchFormat,
        confirmResetAndSwitch,
        cancelResetPrompt,
        toggleBiddingLock,
        refreshTournament: fetchTournament
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
}
