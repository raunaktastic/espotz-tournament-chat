import type { Participant } from "../types/chat"

const TEAM_NAMES = [
  "Nova Squad",
  "Vortex Elite",
  "Shadow Legion",
  "Iron Wolves",
  "Phoenix Rising",
  "Storm Breakers",
  "Crimson Hawks",
  "Neon Strikers",
  "Ghost Protocol",
  "Titan Force",
  "Apex Hunters",
  "Blaze Unit",
  "Frost Guard",
  "Omega Clan",
  "Pulse Gaming",
  "Rogue Syndicate",
] as const

const PLAYER_HANDLES = ["Ace", "Blitz", "Cipher", "Dash"] as const

function isPlayerOnline(teamIndex: number, playerIndex: number): boolean {
  return (teamIndex * 4 + playerIndex) % 3 !== 0
}

function buildPlayer(
  teamIndex: number,
  playerIndex: number,
  teamName: string,
  isCurrentUser = false
): Participant {
  const id = `team-${teamIndex}-player-${playerIndex}`
  const handle = PLAYER_HANDLES[playerIndex]
  const shortTeam = teamName.replace(/\s+/g, "")

  return {
    id,
    name: isCurrentUser ? "Raunak" : `${shortTeam}_${handle}`,
    avatarUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${id}`,
    isOnline: isPlayerOnline(teamIndex, playerIndex),
    isCurrentUser,
    teamName,
  }
}

export const currentUser: Participant = {
  id: "me",
  name: "Raunak",
  avatarUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=gaming",
  isOnline: true,
  isCurrentUser: true,
  teamName: "Nova Squad",
}

/** All players across 16 teams (4 players per team = 64 players). */
export const allTournamentPlayers: Participant[] = TEAM_NAMES.flatMap((teamName, teamIndex) =>
  PLAYER_HANDLES.map((_, playerIndex) => {
    const isCurrentUser = teamIndex === 0 && playerIndex === 0
    return isCurrentUser ? currentUser : buildPlayer(teamIndex, playerIndex, teamName)
  })
)

export function getMatchPlayers(matchIndex: number): Participant[] {
  const players: Participant[] = []

  for (let i = 0; i < 4; i++) {
    const teamIndex = matchIndex * 4 + i
    if (teamIndex >= TEAM_NAMES.length) break
    const playerIndex = i % PLAYER_HANDLES.length
    const teamName = TEAM_NAMES[teamIndex]
    const handle = PLAYER_HANDLES[playerIndex]
    const shortTeam = teamName.replace(/\s+/g, "")

    const player = allTournamentPlayers.find(
      (p) => p.teamName === teamName && (p.isCurrentUser || p.name === `${shortTeam}_${handle}`)
    )
    if (player) players.push(player)
  }

  return players
}

export const tournamentAdmin: Participant = {
  id: "admin",
  name: "NOVA_Admin",
  avatarUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=admin",
  isOnline: true,
  isCurrentUser: false,
  teamName: "Tournament Staff",
}

/** Tournament chat includes admin + every registered player. */
export const tournamentChatParticipants: Participant[] = [
  tournamentAdmin,
  ...allTournamentPlayers.filter((p) => !p.isCurrentUser),
  currentUser,
]
