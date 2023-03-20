import { defineCommand } from "./Command";
import { reply } from "./util";

const instructions = {
    windows: "Download the latest VencordInstaller.exe from GitHub Releases and run it: https://github.com/Vendicated/VencordInstaller/releases/latest/download/VencordInstaller.exe",
    linux: '```sh\nsh -c "$(curl -s https://raw.githubusercontent.com/Vendicated/VencordInstaller/main/install.sh)"\n```',
    mac: `
Download the latest Mac build from GitHub Releases, unzip it, and run \`VencordInstaller.app\`: https://github.com/Vendicated/VencordInstaller/releases/latest/download/VencordInstaller.MacOS.zip

If you get a \`VencordInstaller can't be opened\` message, right-click \`VencordInstaller.app\` and click open.

This error shows because the app isn't signed since I'm not willing to pay 100 bucks a year for an Apple Developer license.
`.trim(),
    get darwin() {
        return this.mac;
    },

    get "more info"() {
        return this.moreinfo;
    },

    get "third party plugins"() {
        return this.plugins;
    },

    get "betterdiscord"() {
        return this.bd;
    },
    moreinfo: `
"doesn't work" or similar are not very helpful.
You can make our lives easier by doing the following steps:
> - Run the /vencord-debug command to send information about your Discord and Vencord to us
> - Are there any errors? Open the console (Ctrl+Shift+I) and check the console tab. If there are any errors (red text), please provide them.
> - Does this issue persistently happen, or only sometimes?
> - Please provide steps to reproduce this issue. Screenshots or videos are also helpful.
`.trim(),

    update: "This issue has already been fixed. Please update to the latest version either using the inbuilt updater tab or by using the installer",
    read: "This issue has already been answered many times. Read <#1027235873990901780> and the most recent posts in <#1024351821873037462>",
    bd: "No, you cannot use Vencord and BetterDiscord together. BetterDiscord plugins do not work on Vencord, and Vencord plugins don't work on BetterDiscord. <:husk:1026532993923293184>",
    plugins: `
All of the plugins you need are built into Vencord under User Settings > Plugins tab.
If you don't see a plugin in the list, it most likely hasn't been made yet.

Third party "custom" plugins and instructions can be found in <#1032200195582197831>.
This requires some command line knowledge, so it is not for the everyday user.
`.trim(),

};

export default defineCommand({
    name: "support",
    async execute(msg, ...guide) {
        const content = instructions[guide.join(" ").toLowerCase()];
        if (content)
            return reply(msg, { content });
    },
});
