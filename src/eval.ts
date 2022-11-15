import { inspect } from "util";

import { defineCommand } from "./Command";
import { reply } from "./util";

export default defineCommand({
    name: "eval",
    ownerOnly: true,
    async execute(msg, ...code) {
        const console: any = {
            _lines: [] as string[],
            _log(...things: string[]) {
                this._lines.push(
                    ...things
                        .map(x => inspect(x, { getters: true }))
                        .join(" ")
                        .split("\n")
                );
            }
        };
        console.log = console.error = console.warn = console.info = console._log.bind(console);

        const { client, channel, author, content, guild, member } = msg;

        let script = code.join(" ").trim().replace(/(^`{3}(js|javascript)?|`{3}$)/g, "");
        if (script.includes("await")) script = `(async () => { ${script} })()`;

        try {
            var result = await eval(script);
        } catch (e: any) {
            var result = e;
        }

        const res = inspect(result).slice(0, 1990);

        return reply(msg, {
            content: "```js\n" + res + "```"
        });
    }
});
