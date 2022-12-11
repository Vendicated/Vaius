import { readFile } from "fs/promises";
import { Message, TextChannel } from 'oceanic.js';
import { fetch, Headers } from "undici";
import { Vaius } from "./Client";
import { formatTable } from './util';

interface Leaderboard {
    members: Record<string, {
        id: number,
        name: string,
        stars: number,
        global_score: number,
        local_score: number;
        last_star_ts: number;
    }>;
}

const LEADERBOARD_URL = "https://adventofcode.com/2022/leaderboard/private/view/1776680";
const CHANNEL_ID = "1051421727684579379";

async function fetchLeaderboard() {
    const data = process.env.NODE_ENV === "production"
        ? await fetch(LEADERBOARD_URL + ".json", {
            method: "GET",
            headers: new Headers({
                cookie: process.env.AOC_COOKIE!,
                "User-Agent": "Vaius Discord Bot (https://github.com/Vendicated/Vaius/tree/main/src/aoc.ts)",
                "Accept": "application/json"
            })
        }).then(res => {
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            return res.json() as Promise<Leaderboard>;
        })
        : await readFile("./data.json", "utf8").then(JSON.parse) as Leaderboard;

    return Object.values(data.members)
        .sort((a, b) =>
            (b.stars - a.stars) || (b.local_score - a.local_score) || (b.global_score - a.global_score)
        );
}

async function makeAocContent() {
    const leaderboard = await fetchLeaderboard();

    const [lastStarTs, lastStarUser] = leaderboard.reduce<[number, string]>(
        ([lastTs, lastUser], u) => [Math.max(lastTs, u.last_star_ts), u.last_star_ts > lastTs ? u.name : lastUser],
        [0, "Noone"]
    );

    const digits = Math.floor(Math.log10(leaderboard[0].stars) + 1);

    const rows = leaderboard.map((u, i) => [
        `${i + 1})`,
        `${u.stars.toString().padStart(digits, " ")}⭐`,
        u.name || "Anonymous",
        `(${u.local_score} points)`
    ]);

    return `
**<a:shiggy:1024751291504791654> Advent of Code Leaderboard <a:shiggy:1024751291504791654>**

Leaderboard: ${LEADERBOARD_URL}
Last Submission: <t:${lastStarTs}> by ${lastStarUser}

` + "```\n" + formatTable(rows) + "```" + `\nLast Updated: <t:${Math.floor(Date.now() / 1000)}>`;
}

let lastMessage: Message;

async function postMessage() {
    const content = await makeAocContent();
    if (lastMessage) {
        if (lastMessage.content !== content)
            lastMessage = await lastMessage.edit({ content });
    } else {
        lastMessage = await (Vaius.getChannel(CHANNEL_ID) as TextChannel).createMessage({ content });
    }
}

Vaius.once("ready", async () => {
    const chan = Vaius.getChannel(CHANNEL_ID) as TextChannel;
    const messages = await chan.getMessages({ limit: 1 });
    lastMessage = messages[0];

    postMessage();
    setInterval(postMessage, 1000 * 60 * 15);
});
