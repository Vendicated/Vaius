import { Member, Message } from "oceanic.js";

import { Vaius } from "./Client";

const mentions = /<@!?(\d{17,20})>/g;

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
