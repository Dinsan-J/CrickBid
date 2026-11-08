import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { tournamentApi } from '../services/api';
import { useAuth, ROLES } from './AuthContext';

const TournamentContext = createContext();

export function TournamentProvider({ children }) {
  const { currentRole, setUser } = useAuth();
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
        if (setUser) {
          setUser(prev => ({
            ...prev,
            activeTournament: {
              id: res.data._id,
              name: res.data.name,
              auctionType: res.data.auctionType,
              currency: res.data.currencyCode,
              status: res.data.status
            }
          }));
        }
      }
    } catch (err) {
      console.warn('Could not fetch active tournament from backend:', err.message);
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
  }, [setUser]);

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
        const updated = {
          ...tournament,
          ...res.data,
          auctionType: targetFormat,
          currencyCode: targetFormat === 'POINTS' ? 'PTS' : 'LKR',
          hasStartedBidding: explicitReset ? false : tournament.hasStartedBidding
        };
        setTournament(updated);
        if (setUser) {
          setUser(prev => ({
            ...prev,
            activeTournament: {
              ...prev?.activeTournament,
              auctionType: updated.auctionType,
              currency: updated.currencyCode
            }
          }));
        }
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

  const isPoints = (tournament?.auctionType || 'MONEY') === 'POINTS';
  const isMoney = !isPoints;
  const currentFormat = isPoints ? 'POINTS' : 'MONEY';
  const currentCurrency = isPoints ? 'PTS' : 'LKR';

  /**
   * Universally formats any monetary amount or point value depending on active format
   * e.g. 850000 in MONEY -> "LKR 850,000"
   * e.g. 850000 in POINTS -> "8,500 PTS"
   */
  const formatAmount = (num) => {
    if (num === null || num === undefined) return '—';
    const val = Number(num);
    if (isNaN(val)) return num;

    if (isPoints) {
      const pts = Math.round(val / 100);
      return `${pts.toLocaleString()} PTS`;
    }
    return `LKR ${val.toLocaleString()}`;
  };

  /**
   * Short representation for badges / counters
   * e.g. "LKR 38.4M" or "384,000 PTS"
   */
  const formatCompact = (num) => {
    if (num === null || num === undefined) return '—';
    const val = Number(num);
    if (isNaN(val)) return num;

    if (isPoints) {
      const pts = Math.round(val / 100);
      return `${pts.toLocaleString()} PTS`;
    }
    if (val >= 1000000) {
      return `LKR ${(val / 1000000).toFixed(1)}M`;
    }
    return `LKR ${val.toLocaleString()}`;
  };

  return (
    <TournamentContext.Provider
      value={{
        tournament,
        loading,
        isUpdating,
        error,
        format: currentFormat,
        currencyCode: currentCurrency,
        isPoints,
        isMoney,
        hasStartedBidding: Boolean(tournament?.hasStartedBidding),
        resetPrompt,
        switchFormat,
        confirmResetAndSwitch,
        cancelResetPrompt,
        toggleBiddingLock,
        refreshTournament: fetchTournament,
        formatAmount,
        formatCompact
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
