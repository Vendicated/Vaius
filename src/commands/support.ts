import { readdir, readFile } from "fs/promises";
import { join } from "path";

import { defineCommand } from "../Command";
import { DATA_DIR } from "../constants";
import { reply } from "../util";

const instructions = {} as Record<string, string>;

defineCommand({
    name: "support",
    aliases: ["s"],
    async execute(msg, ...guide) {
        const content = instructions[guide.join(" ").toLowerCase()];
        if (content)
            return reply(msg, { content });
    },
});

(async () => {
    const supportDir = join(DATA_DIR, "support");
    const files = await readdir(supportDir);

    for (const file of files) {
        let content = (await readFile(join(supportDir, file), "utf8")).trim();
        const fm = /^---\n(.+?)\n---/s.exec(content);
        if (fm) {
            content = content.slice(fm[0].length).trim();
            const attrs = Object.fromEntries(
                fm[1].split("\n").map(x => x.split(": ") as [string, string])
            );

            attrs.aliases?.split(",").forEach(a => (
                instructions[a.trim().toLowerCase()] = content
            ));
        }

        instructions[file.slice(0, -3).toLowerCase()] = content;
    }
})();
