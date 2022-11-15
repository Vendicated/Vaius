import { Message } from "oceanic.js";

export interface Command {
    name: string;
    ownerOnly?: boolean;
    execute(message: Message, ...args: string[]): Promise<any>;
}

export function defineCommand<C extends Command>(command: C) {
    return command;
}
