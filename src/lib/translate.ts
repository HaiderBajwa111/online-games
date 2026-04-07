import translate from 'google-translate-api-x';
import { prisma } from '@/lib/prisma';

export async function autoTranslateGame(game: any) {
    const targetLanguages = ['es', 'fr', 'de', 'pt'];

    // Fields to translate: name [0], description [1], metaTitle [2], metaDescription [3], metaKeywords [4]
    const fields = [
        game.name || 'Game',
        game.description || '',
        game.metaTitle || '',
        game.metaDescription || '',
        game.metaKeywords || ''
    ];

    for (const lang of targetLanguages) {
        try {
            // Free unofficial translate-api-x handles string batches efficiently
            const results = await translate(fields, { to: lang });

            const transName = results[0].text;
            const transDesc = results[1].text;
            const transMetaTitle = fields[2] ? results[2].text : null;
            const transMetaDesc = fields[3] ? results[3].text : null;
            const transMetaKey = fields[4] ? results[4].text : null;

            await prisma.gameTranslation.upsert({
                where: { gameId_language: { gameId: game.id, language: lang } },
                update: {
                    name: transName,
                    description: transDesc,
                    metaTitle: transMetaTitle,
                    metaDescription: transMetaDesc,
                    metaKeywords: transMetaKey
                },
                create: {
                    gameId: game.id,
                    language: lang,
                    name: transName,
                    description: transDesc,
                    metaTitle: transMetaTitle,
                    metaDescription: transMetaDesc,
                    metaKeywords: transMetaKey
                }
            });
            console.log(`Successfully translated ${game.name} to ${lang}`);
        } catch (err) {
            console.error(`Failed to auto-translate game ID ${game.id} to ${lang}:`, err);
        }
    }
}
