import type {
  TournamentChatTree,
  StageChatNode,
  MatchChatNode,
  ChatBreadcrumbSegment,
} from "../types/chat"

export const STAGE_NAMES = [
  "Qualifier",
  "League Stage",
  "Quarter Final",
  "Survival Stage",
  "Semi Finals",
  "Grand Finale",
] as const

function match(
  chatId: string,
  label: string,
  isUserParticipant: boolean,
  status: MatchChatNode["status"] = "live",
  unreadCount?: number
): MatchChatNode {
  return {
    chatId,
    label,
    isUserParticipant,
    chatEnabled: true,
    status,
    unreadCount,
  }
}

export const mockTournamentChatTree: TournamentChatTree = {
  tournamentId: "DemonlLord",
  tournamentName: "DemonlLord",
  lobbyChatId: "tournament",
  stages: [
    {
      id: "stage-qualifier",
      name: "Qualifier",
      stageIndex: 0,
      matchDays: [
        {
          id: "qualifier-day-1",
          label: "Match Day 1",
          matches: [
            match("match-1", "Match 1", true, "completed"),
            match("match-2", "Match 2", false, "completed"),
            match("match-3", "Match 3", true, "live", 2),
          ],
        },
        {
          id: "qualifier-day-2",
          label: "Match Day 2",
          matches: [
            match("match-4", "Match 1", true, "upcoming"),
            match("match-qualifier-d2-m2", "Match 2", false, "upcoming"),
          ],
        },
      ],
    },
    {
      id: "stage-league",
      name: "League Stage",
      stageIndex: 1,
      matchDays: [
        {
          id: "league-day-1",
          label: "Match Day 1",
          matches: [
            match("league-match-1", "Match 1", false, "upcoming"),
            match("league-match-2", "Match 2", false, "upcoming"),
          ],
        },
      ],
    },
    {
      id: "stage-quarter-final",
      name: "Quarter Final",
      stageIndex: 2,
      matchDays: [
        {
          id: "qf-main",
          label: "Main Bracket",
          matches: [match("quarter-final", "Match 1", true, "live")],
        },
      ],
    },
    {
      id: "stage-survival",
      name: "Survival Stage",
      stageIndex: 3,
      matchDays: [
        {
          id: "survival-day-1",
          label: "Match Day 1",
          matches: [match("survival-match-1", "Match 1", false, "upcoming")],
        },
      ],
    },
    {
      id: "stage-semi-finals",
      name: "Semi Finals",
      stageIndex: 4,
      matchDays: [
        {
          id: "semi-main",
          label: "Main Bracket",
          matches: [match("semi-finals-match-1", "Match 1", false, "upcoming")],
        },
      ],
    },
    {
      id: "stage-grand-finale",
      name: "Grand Finale",
      stageIndex: 5,
      matchDays: [
        {
          id: "grand-finale-main",
          label: "Finals",
          matches: [match("grand-finale-match-1", "Match 1", false, "upcoming")],
        },
      ],
    },
  ],
}

function isVisibleMatch(m: MatchChatNode): boolean {
  return m.isUserParticipant && m.chatEnabled
}

function filterStage(stage: StageChatNode): StageChatNode | null {
  const matchDays = stage.matchDays
    .map((day) => ({
      ...day,
      matches: day.matches.filter(isVisibleMatch),
    }))
    .filter((day) => day.matches.length > 0)

  if (matchDays.length === 0) return null

  return { ...stage, matchDays }
}

export function getVisibleNavigatorTree(tree: TournamentChatTree): TournamentChatTree {
  const stages = tree.stages
    .map(filterStage)
    .filter((s): s is StageChatNode => s !== null)

  return { ...tree, stages }
}

export function findChatPath(
  tree: TournamentChatTree,
  chatId: string
): ChatBreadcrumbSegment[] {
  if (chatId === tree.lobbyChatId) {
    return [
      { label: tree.tournamentName },
      { label: "Tournament Lobby", chatId },
    ]
  }

  for (const stage of tree.stages) {
    for (const day of stage.matchDays) {
      for (const m of day.matches) {
        if (m.chatId === chatId) {
          return [
            { label: tree.tournamentName },
            { label: stage.name },
            { label: day.label },
            { label: m.label, chatId },
          ]
        }
      }
    }
  }

  return [{ label: tree.tournamentName }]
}

export function getAutoExpandNodeIds(
  tree: TournamentChatTree,
  chatId: string
): string[] {
  const ids = [tree.tournamentId]

  if (chatId === tree.lobbyChatId) return ids

  for (const stage of tree.stages) {
    for (const day of stage.matchDays) {
      for (const m of day.matches) {
        if (m.chatId === chatId) {
          return [...ids, stage.id, day.id]
        }
      }
    }
  }

  return ids
}

/** Clear unread badge for a chat when the user opens it. */
export function clearUnreadForChat(
  tree: TournamentChatTree,
  chatId: string
): TournamentChatTree {
  return {
    ...tree,
    stages: tree.stages.map((stage) => ({
      ...stage,
      matchDays: stage.matchDays.map((day) => ({
        ...day,
        matches: day.matches.map((m) =>
          m.chatId === chatId && m.unreadCount
            ? { ...m, unreadCount: 0 }
            : m
        ),
      })),
    })),
  }
}
