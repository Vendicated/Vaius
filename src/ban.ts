import { defineCommand } from "./Command";
import { reply } from "./util";

const idRe = /^(?:<@!?)?(\d{17,20})>?$/;

export default defineCommand({
    name: "ban",
    async execute(msg, ...args) {
        if (!msg.inCachedGuildChannel()) return;

        if (!msg.member.permissions.has("BAN_MEMBERS"))
            return reply(msg, { content: "nop" });

        const ids = [] as string[];
        let reason = "Absolutely beaned";
        for (let i = 0; i < args.length; i++) {
            const id = args[i].match(idRe)?.[1];
            if (id) {
                ids.push(id);
            } else {
                reason = args.slice(i).join(" ");
                break;
            }
        }
        if (!ids.length) return reply(msg, { content: "Gimme some users silly" });

        reason = `${msg.author.tag}: ${reason}`;

        const results = [] as string[];
        for (const id of ids) {
            await msg.guild.createBan(id, { reason })
                .catch(e => results.push(`Failed to ban ${id}: \`${String(e)}\``));
        }

        return reply(msg, { content: results.join("\n") || "Done!" });
    }
});
