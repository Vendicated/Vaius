import { defineCommand } from "../Command";
import { VENCORD_SITE } from "../constants";
import { makeCachedJsonFetch } from "../util";

interface Faq {
    question: string;
    answer: string;
    tags: string[];
}

const fetchFaq = makeCachedJsonFetch<Faq[]>(VENCORD_SITE + "/faq.json");

defineCommand({
    name: "faq",
    aliases: ["f"],
    async execute(msg, query) {
        if (!msg.inCachedGuildChannel()) return;

        const faq = await fetchFaq();

        const match = (() => {
            if (!query) return;

            const idx = Number(query);
            if (!isNaN(idx)) return faq[idx - 1];

            query = query.toLowerCase();
            return faq.find(f =>
                f.tags.includes(query) ||
                f.question.toLowerCase().includes(query)
            );
        })();

        if (match) {
            return msg.channel.createMessage({
                embeds: [{
                    title: match.question,
                    description: match.answer,
                    color: 0xdd7878
                }],
            });
        }

        return msg.channel.createMessage({
            content: faq.map((f, i) =>
                `**${i + 1}**. ${f.question} (${f.tags.map(t => "`" + t + "`").join(", ")})`
            ).join("\n")
        });
    },
});
