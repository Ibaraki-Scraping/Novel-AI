import { NovelAI } from "../NovelAI";

export class StoryContent {

    id: string;
    type: "storycontent";
    meta: string;
    data: {
        storyContentVersion: number;
        settings: {
            parameters: any,
            preset: "default-genesis" | "default-basic-coherence" | "default-ouroboros" | "default-ace-of-spades" | "default-moonlit-chronicler" | "default-fandango" | "default-all-nighter" | "default-low-rider-2" | "default-morpho" | "default-prowriter20",
            trimResponses: boolean,
            banBrackets: boolean,
            prefix: string, // strict string ?
            dynamicPenaltyRange: boolean,
            prefixMode: number,
            mode: number,
            model: "6B-v4" | "euterpe-v2" | "krake-v2" | "clio-v1" | "genji-jp-6b-v2" | "genji-python-6b", 
        },
        story: {
            version: number,
            step: number,
            datablocks: any[],
            currentBlock: number,
            fragments: any[],
        },
        context: any[],
        lorebook: {
            lorebookVersion: number,
            entries: any[],
            settings: any,
            categories: any[],
        },
        storyContextConfig: {
            prefix: string,
            suffix: string,
            tokenBudget: number,
            reservedTokens: number,
            budgetPriority: number,
            trimDirection: string, // strict string ?
            insertionType: string, // strict string ?
            maximumTrimType: string, // strict string ?
            intertionPosition: number,
            allowIntertionInside: boolean,
        },
        ephemeralContext: any[],
        contextDefaults: {
            ephemeralDefaults: any[],
            loreDefaults: any[],
        },
        dettingsDirty: boolean,
        didGenerate: boolean,
        phraseBiasGroups: any[],
        bannedSequenceGroups: any[],
    };
    lastUpdatedAt: number;
    changeIndex: number;

    constructor(private ai: NovelAI, data: StoryContent) {

    }

}