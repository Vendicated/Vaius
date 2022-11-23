import { readFile } from "fs/promises";
import { Member, Message } from "oceanic.js";
import { join } from "path";
import { fetch } from "undici";

import { Vaius } from "./Client";

const mentions = /<@!?(\d{17,20})>/g;

// matches nothing
let imageHostRegex = /^(?!a)a/;

Promise.all(["sxcu.txt", "upload-systems.txt"].map(async s => {
    const content = await readFile(join(__dirname, "..", "data", "annoying-domains", s), "utf8");
    return content.trim().split("\n");
})).then(domains => {
    const list = domains.flat().filter(Boolean).map(d => d.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"));
    imageHostRegex = new RegExp(`https?://(${list.join("|")})`, "g");
    console.log(`Loaded ${list.length} image hosts`);
});

export async function moderateMessage(msg: Message) {
    if (!msg.inCachedGuildChannel()) return;
    if (!msg.channel.permissionsOf(Vaius.user.id).has("MANAGE_MESSAGES")) return;

    const allMentions = [...msg.content.matchAll(mentions)];

    const dupeCount = allMentions.reduce((acc, [, id]) => {
        acc[id] ??= 0;
        acc[id]++;
        return acc;
    }, {} as Record<string, number>);

    if (Object.values(dupeCount).some(x => x >= 3)) {
        await msg.delete();
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
        await member.edit({
            nick: "I am a lame face"
        });
}

const Size8MB = 1024 * 1024 * 8;

export async function moderateImageHosts(msg: Message) {
    const matches = msg.content.match(imageHostRegex) ?? [];
    for (const match of matches) {
        const embed = msg.embeds.find(e => e.url?.startsWith(match));
        if (!embed) continue;

        const img = embed.image || embed.thumbnail;
        if (!img) continue;

        const url = img.proxyURL || img.url;
        const size = await fetch(url, { method: "HEAD" })
            .then(d => d.headers.get("content-length"));

        if (Number(size) > Size8MB)
            continue;

        await msg.delete();
        const dm = await msg.author.createDM().catch(() => void 0);
        dm?.createMessage({
            content: "cdn.discordapp.com is a free and great way to share images! (Please stop using stupid image hosts)"
        });
    }
}
