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
    moreinfo: `
"doesn't work" or similar are not very helpful.
You can make our lives easier by providing the following information:
> - What platform are you on? Windows, Mac, Linux?
> - What client are you using? Discord Desktop, Discord Web, Armcord...?
> - What branch are you on? Stable, Canary, PTB...? If not on stable, does it work on stable?
> - Are you fully up to date? You can check by going to the Updater settings tab. If you cannot access that page, use the installer. If no, update and try again
> - Are there any errors? Open the console (Ctrl+Shift+I) and check the console tab. If there are any errors (red text), please provide them.
> - Does this issue persistently happen, or only sometimes?
> - Please provide steps to reproduce this issue. Screenshots or videos are also helpful.
`.trim(),

    update: "This issue has already been fixed. Please update to the latest version either using the inbuilt updater tab or by using the installer",
    
    windowheight: `
    windows: \`%appdata%/discord<branch>/settings.json\`
    Linux: \`~/.config/discord<branch>/settings.json\`
    Edit \`MIN_WIDTH\` and \`MIN_HEIGHT\` in the json to your likings
    `.trim(),
        
    abuse: `
Plugins that are api spam or abusive are not allowed
This includes things like animated status, message pruner, auto economy plugins, and so on...
`.trim(),

    explode: "explode"
};

export default defineCommand({
    name: "support",
    async execute(msg, ...guide) {
        const content = instructions[guide.join(" ").toLowerCase()];
        if (content)
            return reply(msg, { content });
    },
});
