import { Message } from "oceanic.js";

import { reply } from "./util";

export default function yardim(msg: Message) {
    if (msg.content.includes("yardim"))
        reply(msg, {
            embeds: [{
                title: "aıera | YARDIM MENÜSÜ",
                thumbnail: {
                    url: "https://cdn.discordapp.com/avatars/881772996614819941/257d1e3205e1cb2d368106513d49a25b.png",
                },
                description: `
**-yardım**
açıklama

**komutad**
açıklama

**komutad**
açıklama

**komutad**
açıklama

**komutad**
açıklama

**komutad
açıklama

**komutad**
komut açıklama`.trim()
            }]
        });
}
