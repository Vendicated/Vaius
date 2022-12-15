import { CreateMessageOptions, Message, User } from "oceanic.js";

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

const ZWSP = "\u200B";

export function formatTable(rows: string[][]) {
    const highestLengths = Array.from({ length: rows[0].length }, (_, i) => Math.max(...rows.map(r => r[i].length)));

    return ZWSP + rows.map(
        row => row.map((s, i) => s.padStart(highestLengths[i], " ")).join("    ")
    ).join("\n");
}

export function until(ms: number) {
    return new Date(Date.now() + ms).toISOString();
}

export async function silently<T>(p?: Promise<T>) {
    try {
        return await p;
    } catch { }
}

export async function sendDm(user: User, data: CreateMessageOptions) {
    const dm = await silently(user.createDM());
    return !!dm && dm?.createMessage(data).then(() => true).catch(() => false);
}
