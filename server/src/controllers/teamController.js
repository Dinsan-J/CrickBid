import { Team } from '../models/Team.js';
import { Player } from '../models/Player.js';

export async function getTeams(req, res) {
  try {
    const teams = await Team.find().sort({ name: 1 });

    // Populate players acquired for each team
    const teamsWithPlayers = await Promise.all(
      teams.map(async (team) => {
        const acquiredPlayers = await Player.find({ soldToTeamId: team._id }).select('fullName playingRole soldPrice photoUrl');
        const teamObj = team.toObject();
        teamObj.playersList = acquiredPlayers;
        teamObj.squadCount = acquiredPlayers.length || team.squadSize;
        return teamObj;
      })
    );

    return res.json({
      success: true,
      count: teamsWithPlayers.length,
      data: teamsWithPlayers
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getTeamById(req, res) {
  try {
    const { id } = req.params;
    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    const players = await Player.find({ soldToTeamId: team._id });
    return res.json({
      success: true,
      data: {
        ...team.toObject(),
        players
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
