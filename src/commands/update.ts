import { execSync } from "child_process";

import { defineCommand } from "../Command";
import { codeblock, reply, silently } from "../util";

defineCommand({
    name: "update",
    description: "Update the bot",
    ownerOnly: true,
    async execute(msg) {
        try {
            if (!execSync("git pull").toString().includes("Fast-forward"))
                return reply(msg, {
                    content: "Already up to date"
                });

            execSync("pnpm build");

            await silently(reply(msg, {
                content: "Updated!! Now restarting..."
            }));

            execSync("pm2 restart vaius");
        } catch (e) {
            console.error(e);
            reply(msg, {
                content: "Failed to update: " + codeblock(String(e), "")
            });
        }
    }
});
