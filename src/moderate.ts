import { readdir, readFile } from "fs/promises";
import { EmbedImage, EmbedVideo, Member, Message } from "oceanic.js";
import { join } from "path";
import { fetch } from "undici";

import { Vaius } from "./Client";
import { sendDm, silently, until } from "./util";

const mentions = /<@!?(\d{17,20})>/g;

// matches nothing
let imageHostRegex = /^(?!a)a/;

const annoyingDomainsDir = join(__dirname, "..", "data", "annoying-domains");
readdir(annoyingDomainsDir).then(files =>
    Promise.all(files.filter(f => f !== "README.md").map(async s => {
        const content = await readFile(join(annoyingDomainsDir, s), "utf8");
        return content.trim().split("\n");
    }))
).then(domains => {
    const list = domains.flat().filter(Boolean).map(d => d.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"));
    imageHostRegex = new RegExp(`https?://(\\w+\\.)?(${list.join("|")})`, "g");
    console.log(`Loaded ${list.length} image hosts`);
});

const ChannelRules: Record<string, (m: Message) => string | void> = {
    "1028106818368589824"(m) {
        if (m.content.includes("```css")) return;
        if (m.content.includes("https://")) return;
        if (m.attachments?.some(a => a.filename?.endsWith(".css"))) return;
        return "Please only post css snippets. To ask questions or discuss snippets, make a thread.";
    }
};

export async function moderateMessage(msg: Message) {
    if (!msg.inCachedGuildChannel()) return;
    if (!msg.channel.permissionsOf(Vaius.user.id).has("MANAGE_MESSAGES")) return;

    const warnText = ChannelRules[msg.channel.id]?.(msg);
    if (warnText) {
        silently(msg.delete().then(() => sendDm(msg.author, { content: warnText })));
        return;
    }

    const allMentions = [...msg.content.matchAll(mentions)];

    const dupeCount = allMentions.reduce((acc, [, id]) => {
        acc[id] ??= 0;
        acc[id]++;
        return acc;
    }, {} as Record<string, number>);

    const dupeCounts = Object.values(dupeCount);
    if (dupeCounts.length > 10) {
        silently(msg.delete());
        silently(msg.member.edit({ communicationDisabledUntil: until(1000 * 60 * 60 * 5), reason: "mass ping" }));
        return;
    }

    if (Object.values(dupeCount).some(x => x >= 3)) {
        silently(msg.delete());
        silently(msg.member.edit({ communicationDisabledUntil: until(1000 * 30), reason: "ping spam" }));
        return;
    }

    moderateImageHosts(msg);
}

const saneName = /\w/;
export async function moderateNick(member: Member) {
    if (!member.guild.permissionsOf(Vaius.user.id).has("MANAGE_NICKNAMES")) return;

    const name = member.nick ?? member.user.username;

    const isLame = name.startsWith("!") || !saneName.test(name) || name.includes("nigger");

    if (isLame)
        silently(member.edit({
            nick: "I am a lame face"
        }));
}

const Size8MB = 1024 * 1024 * 8;

export async function moderateImageHosts(msg: Message) {
    const matches = msg.content.match(imageHostRegex) ?? [];
    for (const match of matches) {
        const embed = msg.embeds.find(e => e.url?.startsWith(match));
        if (!embed) continue;

        const img: EmbedImage | EmbedVideo | undefined = embed.video || embed.image || embed.thumbnail;
        if (!img) continue;

        const url = img.proxyURL || img.url;
        if (!url) continue;

        const size = await fetch(url, { method: "HEAD" })
            .then(d => d.headers.get("content-length"))
            .catch(() => Number.MAX_VALUE);

        if (Number(size) > Size8MB)
            continue;

        silently(msg.delete().then(() =>
            sendDm(msg.author, {
                content: "cdn.discordapp.com is a free and great way to share images! (Please stop using stupid image hosts)"
            })
        ));
    }
}
