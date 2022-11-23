import { defineCommand } from "./Command";
import { reply } from "./util";

const idRe = /^(?:<@!?)?(\d{17,20})>?$/;

export default defineCommand({
    name: "ban",
    async execute(msg, user, reason) {
        if (!msg.inCachedGuildChannel()) return;

        if (!msg.member.permissions.has("BAN_MEMBERS"))
            return reply(msg, { content: "nop" });

        const id = idRe.exec(user ?? "")?.[1];
        if (id)
            return msg.guild.createBan(id, { reason: `${msg.author.tag}: ${reason || "Absolutely beaned"}` })
                .then(() => reply(msg, { content: "Absolutely beaned" }))
                .catch(err => reply(msg, { content: String(err) }));
    }
});
