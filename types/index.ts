import type { Event, Request } from "lenix";
import type { playerStatuses } from "../resource/common/config";

export interface Storage {
  theme: "dark" | "light";
}

export namespace Rank {
  export interface Events {
    open: Event<"rank:open", []>;
  }

  export interface Requests {
    profile: Request<Player["Profile"], "rank:profile">;
    leaderboard: Request<Leaderboard, "rank:leaderboard">;
    party: {
      get: Request<Party, "rank:party:get">;
      setSize: Request<Party, "rank:party:setSize", { size: number }>;
    };
    matches: Request<Player["Matches"], "rank:matches">;
  }

  export interface Player {
    Profile: {
      id: number;
      name: string;
      avatar: string;
      status: keyof typeof playerStatuses;
      stats: {
        kills: number;
        deaths: number;
        assits: number;
        wins: number;
        losses: number;
        winRate: number;
        killsDeathsRatio: number;
        matches: number;
      };
      friends: Player["Profile"]["id"][];
    };
    Matches: [
      {
        id: `match-${number}`;
        mode: `${number}v${number}`;
        map: Match["Map"];
        playedAt: number;
        result: Match["Result"];
        duration: number;
        scoreChange: number;
        stats: {
          kills: number;
          deaths: number;
          assits: number;
        };
      },
    ];
    Stats: {
      kills: number;
      deaths: number;
      assits: number;
      wins: number;
      losses: number;
    };
    Notification: {
      id: string;
      type: "party_invite";
      title: string;
      description: string;
      createdAt: number;
      author: {
        avatar: string;
      };
    };
  }

  export interface Match {
    Map: "Downtown";
    Result: "win";
  }

  export interface Party {
    profiles: Player["Profile"][];
  }

  export type Leaderboard = {
    place: number;
    userId: any;
    name: any;
    avatar: any;
    score: number;
  }[];
}
