import {
    ApplicationCommandTypes,
    InteractionTypes
} from "oceanic.js";

import { Vaius } from "./Client";

if (process.env.NODE_ENV === "production") {
    Vaius.once("ready", () => {
        Vaius.application.createGlobalCommand({
            type: ApplicationCommandTypes.CHAT_INPUT,
            name: "owo",
            description: "owo",
        });
    });

    Vaius.on("interactionCreate", i => i.type === InteractionTypes.APPLICATION_COMMAND && i.createMessage({
        content: "owo"
    }));
}

process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

Vaius.connect();
