import { defineCommand } from "./Command";
import { VENCORD_SITE } from "./constants";
import { makeCachedJsonFetch } from "./util";

interface Faq {
    question: string;
    answer: string;
}

const fetchFaq = makeCachedJsonFetch<Faq[]>(VENCORD_SITE + "/faq.json");

export default defineCommand({
    name: "faq",
    async execute(msg, query) {
        if (!msg.inCachedGuildChannel()) return;

        const faq = await fetchFaq();

        const match = (() => {
            if (!query) return;

            const idx = Number(query);
            if (!isNaN(idx)) return faq[idx - 1];
            return faq.find(f => f.question.toLowerCase().includes(query.toLowerCase()));
        })();

        if (match) {
            return msg.channel.createMessage({
                embeds: [{
                    title: match.question,
                    description: match.answer,
                }],
            });
        }

        return msg.channel.createMessage({
            content: faq.map((f, i) => `**${i + 1}**. ${f.question}`).join("\n")
        });
    },
});
