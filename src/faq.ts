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
    async execute(message, query) {
        const faq = await fetchFaq();

        const match = !isNaN(Number(query)) ? faq[query] : faq.find(f => f.question.toLowerCase().includes(query.toLowerCase()));

        if (match) {
            return message.channel?.createMessage({
                embeds: [{
                    title: match.question,
                    description: match.answer,
                }],
            });
        }

        return message.channel?.createMessage({
            content: faq.map((f, i) => `**${i + 1}**. ${f.question}`).join("\n")
        });
    },
});
