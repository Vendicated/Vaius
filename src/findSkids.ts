
import { ActivityTypes } from "oceanic.js";

import { defineCommand } from "./Command";
import { sendManyLines } from "./util";

export default defineCommand({
    name: "findskids",
    ownerOnly: true,
    async execute(msg) {
        const members = await msg.guild!!.fetchMembers({
            presences: true
        });

        const skids = [] as [string, string][];

        outer:
        for (const { presence, mention } of members) {
            if (!presence) continue;
            const { web } = presence.client_status;
            if ((web === "dnd" || web === "idle") && presence.client_status.desktop === "online") {
                skids.push([mention, "web dnd/idle while online on desktop"]);
                continue outer;
            }

            for (const a of presence.activities ?? []) {
                if (a.type === ActivityTypes.STREAMING && !a.url) {
                    skids.push([mention, "streaming with no URL"]);
                    continue outer;
                }
                if (a.type === ActivityTypes.LISTENING && a.name !== "Spotify") {
                    skids.push([mention, "listening to non-spotify: " + a.name]);
                    continue outer;
                }

                if (a.state) {
                    const s = a.state.toLowerCase();
                    for (const word of ["playz", "selling", "accounts", "trade", "cheap nitro",]) {
                        if (s.includes(word)) {
                            skids.push([mention, "sus presence: " + word]);
                            continue outer;
                        }
                    }
                }
            }
        }

        return sendManyLines(msg, skids.map(([mention, reason]) => `${mention}: ${reason}`));
    }
});
