const API_BASE = import.meta.env.VITE_API_URL || '';

export const tournamentApi = {
  async getActive() {
    const res = await fetch(`${API_BASE}/api/v1/tournaments/active`);
    if (!res.ok) throw new Error('Failed to load active tournament');
    return res.json();
  },

  async updateFormat(id, format, userRole, resetAuction = false) {
    const res = await fetch(`${API_BASE}/api/v1/tournaments/${id}/auction-format`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ format, userRole, resetAuction })
    });
    const data = await res.json();
    if (!res.ok) {
      const error = new Error(data.message || 'Failed to update auction format');
      error.isLocked = data.isLocked;
      throw error;
    }
    return data;
  },

  async toggleBidding(id, hasStartedBidding) {
    const res = await fetch(`${API_BASE}/api/v1/tournaments/${id}/toggle-bidding`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hasStartedBidding })
    });
    return res.json();
  }
};

export const playerApi = {
  async register(formData) {
    const res = await fetch(`${API_BASE}/api/v1/players/register`, {
      method: 'POST',
      body: formData // can be FormData object or JSON
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to register player');
    }
    return data;
  },

  async registerJson(payload) {
    const res = await fetch(`${API_BASE}/api/v1/players/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to register player');
    }
    return data;
  },

  async getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/api/v1/players${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to load players');
    return res.json();
  },

  async getById(id) {
    const res = await fetch(`${API_BASE}/api/v1/players/${id}`);
    if (!res.ok) throw new Error('Failed to load player details');
    return res.json();
  },

  async updateStatus(id, status, userRole) {
    const res = await fetch(`${API_BASE}/api/v1/players/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, userRole })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update player status');
    }
    return data;
  }
};

export const teamApi = {
  async getAll() {
    const res = await fetch(`${API_BASE}/api/v1/teams`);
    if (!res.ok) throw new Error('Failed to load teams');
    return res.json();
  },

  async getById(id) {
    const res = await fetch(`${API_BASE}/api/v1/teams/${id}`);
    if (!res.ok) throw new Error('Failed to load team details');
    return res.json();
  }
};
