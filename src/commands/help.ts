import { Commands, defineCommand } from "../Command";
import { PREFIX } from "../constants";
import { reply } from "../util";

defineCommand({
    name: "help",
    aliases: ["h", "?"],
    execute(msg) {
        const lines = [] as string[];

        for (const name in Commands) {
            const cmd = Commands[name];
            // alias
            if (cmd.name !== name) continue;

            let help = `${PREFIX}**${cmd.name}**`;
            if (cmd.aliases?.length)
                help += ` (${cmd.aliases.join(", ")})`;
            if (cmd.ownerOnly)
                help += " 👑";

            help += " - Does stuff idk";

            lines.push(help);
        }

        return reply(msg, { content: lines.join("\n") });
    },
});
