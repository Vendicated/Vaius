import { Client, Intents } from "oceanic.js";

import { Command } from "./Command";
import { moderateMessage, moderateNick } from "./moderate";
import { reply } from "./util";

const commands: Record<string, Command> = {
    eval: require("./eval").default,
    findskids: require("./findSkids").default,
    ban: require("./ban").default,
    support: require("./support").default,
    faq: require("./faq").default,
    prune: require("./prune").default,
};

export const Vaius = new Client({
    auth: "Bot " + process.env.DISCORD_TOKEN,
    gateway: {
        intents:
            Intents.MESSAGE_CONTENT | Intents.GUILDS | Intents.DIRECT_MESSAGES |
            Intents.GUILD_MEMBERS | Intents.GUILD_MESSAGES | Intents.GUILD_PRESENCES
    },
    allowedMentions: {
        everyone: false,
        repliedUser: false,
        roles: false,
        users: false
    }
});

let ownerId: string;
Vaius.once("ready", () => {
    Vaius.rest.oauth.getApplication().then(app => {
        ownerId = app.ownerID;
    });

    console.log("hi");
    console.log(`Connected as ${Vaius.user.tag} (${Vaius.user.id})`);
    console.log(`I am in ${Vaius.guilds.size} guilds`);
});

const spaces = /\s+/;
const PREFIX = "v";

Vaius.on("messageCreate", async msg => {
    if (msg.author.bot) return;
    moderateMessage(msg);

    if (!msg.content?.startsWith(PREFIX)) return;

    const args = msg.content.slice(PREFIX.length).trim().split(spaces);
    const cmd = commands[args.shift()!];
    if (!cmd) return;

    if (cmd.ownerOnly && msg.author.id !== ownerId)
        return void reply(msg, { content: "nop" });

    try {
        await cmd.execute(msg, ...args);
    } catch (e) {
        console.error(`Failed to run ${cmd.name}`);
        console.error("> ", msg.content);
        console.error(e);
        await reply(msg, { content: "Oopsie!" });
    }
});

Vaius.on("guildMemberUpdate", m => moderateNick(m));
Vaius.on("guildMemberAdd", m => moderateNick(m));
