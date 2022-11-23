import { CreateMessageOptions, Message } from "oceanic.js";

export function reply(msg: Message, opts: CreateMessageOptions): Promise<Message> {
    return msg.channel!.createMessage({
        ...opts,
        messageReference: {
            messageID: msg.id,
            channelID: msg.channelID,
            guildID: msg.guildID!
        }
    });
}

export function sleep(ms: number) {
    return new Promise(r => setTimeout(r, ms));
}

export async function sendManyLines(msg: Message, lines: string[]) {
    let s = "";
    const doSend = () => msg.channel?.createMessage({ content: s });
    for (const line of lines) {
        if (s.length + line.length >= 2000) {
            await doSend();
            await sleep(500);
            s = "";
        }
        s += line + "\n";
    }
    if (s) await doSend();
}
