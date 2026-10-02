import type { Warzone } from "types/index";
import { oxmysql } from "@overextended/oxmysql";
import { Parties } from "./party";
import { palette } from "lenix";
import { fullName, getProfileId } from "./utils";
import {
  fetchProfile,
  getBucketProfiles as getProfilesBucket,
  getProfiles,
  getStatsDetails,
  profileCols,
} from "./modules";
import { asserts, entries } from "@lenix/lenix";
import { Constants } from "common/config/constants";
import { onNuiServer } from "lenix/server";

const performancesCols = ["result", "kills", "deaths", "assists"] as const;
const defaultStats = {
  kills: 0,
  deaths: 0,
  assists: 0,
  wins: 0,
  losses: 0,
};

onNuiServer<Warzone.Requests["getProfile"]>("warzone:getProfile", async (client) => {
  return {
    ...(await fetchProfile(client)),
    sessionId: client,
  };
});

onNuiServer<Warzone.Requests["getProfiles"]>("warzone:getProfiles", async () => {
  return await getProfiles();
});

onNuiServer<Warzone.Requests["getParty"]>("warzone:getParty", async (client) => {
  return Parties.getParty(client);
});

onNuiServer<Warzone.Requests["getGamerProfile"]>("warzone:getGamerProfile", async (client) => {
  return (
    Parties.getProfileFromParties(client, undefined, true) ?? { ...(await fetchProfile(client)), sessionId: client }
  );
});

onNuiServer<Warzone.Requests["acceptInvite"]>("warzone:acceptInvite", (client, { inviter }) => {
  return (Parties.acceptInvite(client, inviter), null);
});

onNuiServer<Warzone.Requests["setPartySize"]>("warzone:setPartySize", (client, { size }) => {
  return (Parties.setSize(client, size), null);
});

onNuiServer<Warzone.Requests["updateReadiness"]>("warzone:updateReadiness", async (client, { status }) => {
  return (await Parties.updateReadiness(client, status), null);
});

onNuiServer<Warzone.Requests["leaveParty"]>("warzone:leaveParty", async (client) => {
  return (await Parties.leaveParty(client), null);
});

onNuiServer<Warzone.Requests["invitePlayer"]>("warzone:invitePlayer", (client, { invited }) => {
  return (Parties.invite(client, invited), null);
});

onNuiServer<Warzone.Requests["ignoreInvites"]>("warzone:ignoreInvites", (client, { inviter }) => {
  return (Parties.ignoreInvites(client, inviter), null);
});

onNuiServer<Warzone.Requests["kickProfile"]>("warzone:kickProfile", async (client, { profile }) => {
  return (await Parties.kick(client, profile), null);
});

onNuiServer<Warzone.Requests["updateMatchmaking"]>("warzone:updateMatchmaking", async (client, { status }) => {
  return (await Parties.updateMatchmaking(client, status), null);
});

onNuiServer<Warzone.Requests["transferLeadership"]>("warzone:transferPartyLeadership", (client, { leader }) => {
  return (Parties.transferLeadership(client, leader), null);
});

onNuiServer<Warzone.Requests["updatePartyGameMode"]>("warzone:updatePartyGameMode", (client, { mode }) => {
  return (Parties.updateGameMode(client, mode), null);
});

onNuiServer<Warzone.Requests["getMatches"]>("warzone:getMatches", async (client) => {
  const profileId = getProfileId(client);

  const selectedCols = ["match_id", "result", "kills", "deaths", "assists"] as const;
  const selectedMatchsCols = ["match_id", "map", "played_at"] as const;

  try {
    const matchesPerformance = (await oxmysql.query<
      {
        match_id: number;
        result: "win" | "loss";
        kills: number;
        deaths: number;
        assists: number;
      }[]
    >(`SELECT ${selectedCols.join(", ")} FROM ${fullName("performances")} WHERE profile_id = ?`, [
      profileId,
    ])) satisfies Record<(typeof selectedCols)[number], any>[];
    if (!matchesPerformance.length) return [];

    //@ts-expect-error
    const matches: {
      match_id: number;
      map: string;
      played_at: number;
    }[] = (await oxmysql.query(
      `SELECT ${selectedMatchsCols.join(", ")} FROM ${fullName("matches")} WHERE profile_id = ?`,
      [profileId],
    )) satisfies Record<(typeof selectedMatchsCols)[number], any>[];

    return matches.map((match) => {
      const matchPerformance = matchesPerformance.find((self) => self.match_id === match.match_id);
      asserts(matchPerformance, `Could not find match<${match.match_id}> in matchesPerformance`);

      return {
        ...match,
        delta:
          matchPerformance.assists * Constants.warzone.score_weights.assist +
          matchPerformance.deaths * Constants.warzone.score_weights.death +
          matchPerformance.kills * Constants.warzone.score_weights.kill +
          (matchPerformance.result === "win"
            ? Constants.warzone.score_weights.win
            : Constants.warzone.score_weights.loss),
        result: matchPerformance.result,
        stats: {
          kills: matchPerformance.kills,
          deaths: matchPerformance.deaths,
          assits: matchPerformance.assists,
        },
      };
    });
  } catch (e) {
    throw e;
  }
});

onNuiServer<Warzone.Requests["getFriends"]>("warzone:getFriends", async (client) => {
  const selectedCols = ["sender_id", "receiver_id", "status"] as const;
  const profile_id = getProfileId(client);

  try {
    const friends = (await oxmysql.query<
      {
        status: "accepted" | "pending";
        sender_id: string;
        receiver_id: string;
      }[]
    >(
      `SELECT ${selectedCols.join(", ")} FROM ${fullName("friends")} WHERE (sender_id = ? OR receiver_id = ?) AND status = ?`,
      [profile_id, profile_id, "accepted"],
    )) satisfies Record<(typeof selectedCols)[number], any>[];

    const friendIds = friends.map((friend) =>
      friend.sender_id === profile_id ? friend.receiver_id : friend.sender_id,
    );
    if (!friendIds.length) return [];

    const profiles = (await oxmysql.query<
      {
        profile_id: string;
        name: string;
        status: "online" | "offline" | "dnd";
      }[]
    >(`SELECT ${profileCols.join(", ")} FROM ${fullName("profiles")} WHERE profile_id IN (?)`, [
      friendIds,
    ])) satisfies Record<(typeof profileCols)[number], any>[];

    return await getProfilesBucket(profiles);
  } catch (e) {
    console.log(palette("red", String(e)));
    throw e;
  }
});

onNuiServer<Warzone.Requests["setStatus"]>("warzone:setStatus", async (client, { status }) => {
  const profileId = getProfileId(client);

  try {
    const re = await oxmysql.query(`UPDATE ${fullName("profiles")} SET status = ? WHERE profile_id = ?`, [
      status,
      profileId,
    ]);
    asserts(re, `Failed to update status for player<${client}>`);
    return true as const;
  } catch (error) {
    console.log(palette("red", String(error)));
    throw error;
  }
});

onNuiServer<Warzone.Requests["getStats"]>("warzone:getStats", async (client) => {
  const profile_id = getProfileId(client);

  const performances = (await oxmysql.query<
    {
      result: "win" | "loss";
      kills: number;
      deaths: number;
      assists: number;
    }[]
  >(`SELECT ${performancesCols.join(", ")} FROM ${fullName("performances")} WHERE profile_id = ?`, [
    profile_id,
  ])) satisfies Record<(typeof performancesCols)[number], any>[];

  return getStatsDetails(performances);
});

onNuiServer<Warzone.Requests["party"]["getStats"]>("warzone:party:getStats", async (_client, { profiles }) => {
  const selectedCols = ["profile_id", ...performancesCols] as const;
  try {
    const performances = (await oxmysql.query<
      {
        profile_id: string;
        result: "win" | "loss";
        kills: number;
        deaths: number;
        assists: number;
      }[]
    >(`SELECT ${selectedCols.join(", ")} FROM ${fullName("performances")} WHERE profile_id IN (?)`, [
      profiles,
    ])) satisfies Record<(typeof selectedCols)[number], any>[];

    return Object.fromEntries(
      entries(
        Object.fromEntries(
          profiles.map((profile_id) => [
            profile_id,
            Object.fromEntries(performances.map(({ profile_id, ...stat }) => [profile_id, stat]))[profile_id] ?? {
              kills: 0,
              deaths: 0,
              assists: 0,
              result: "loss",
            },
          ]),
        ),
      ).map(([profile_id, stat]) => [profile_id, getStatsDetails([stat])]),
    );
  } catch (e) {
    console.log(palette("red", String(e)));
    throw e;
  }
});

onNuiServer<Warzone.Requests["getLeaderboard"]>("warzone:getLeaderboard", async () => {
  const selectedCols = ["match_id", "profile_id", "result", "kills", "deaths", "assists"] as const;
  const performances: Warzone.Performance[] = (await oxmysql.query<
    {
      match_id: number;
      profile_id: string;
      result: "win" | "loss";
      kills: number;
      deaths: number;
      assists: number;
    }[]
  >(`SELECT ${selectedCols.join(", ")} FROM ${fullName("performances")}`)) satisfies Record<
    (typeof selectedCols)[number],
    any
  >[];

  if (!performances.length) return [];

  const profiles = await getProfiles();

  const statsByProfile = new Map<
    Warzone.Profile["profile_id"],
    Pick<Warzone.Stats, "kills" | "deaths" | "assists" | "wins" | "losses">
  >();

  //@ts-expect-error
  for (const performance of performances) {
    const current = statsByProfile.get(performance.profile_id) ?? defaultStats;

    current.kills += performance.kills;
    current.deaths += performance.deaths;
    current.assists += performance.assists;
    current.wins += performance.result === "win" ? 1 : 0;
    current.losses += performance.result === "loss" ? 1 : 0;

    statsByProfile.set(performance.profile_id, current);
  }

  return profiles
    .map((profile) => ({
      score: (() => {
        const stats = statsByProfile.get(profile.profile_id) ?? defaultStats;
        // if (!stats) throw `Failed to get stats for profile_id<${profile.profile_id}>`

        return Math.max(
          0,
          stats.wins * Constants.warzone.score_weights.win +
            stats.kills * Constants.warzone.score_weights.kill +
            stats.losses * Constants.warzone.score_weights.loss +
            stats.deaths * Constants.warzone.score_weights.death +
            stats.assists * Constants.warzone.score_weights.assist,
        );
      })(),
      profile_id: profile.profile_id,
      name: profile.name,
      avatar: profile.avatar,
    }))
    .sort((a, b) => b.score - a.score)
    .map((profile, index) => ({
      ...profile,
      place: index + 1,
    }));
});
