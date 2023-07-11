import { NovelAI } from "../NovelAI";

export class StoryContent {

    id?: string;
    type?: "storycontent";
    meta?: string;
    data?: {
        storyContentVersion?: number;
        settings?: {
            parameters?: {
                textGenerationSettingsVersion: number,
                temperature?: number,
                max_length?: number,
                min_length?: number,
                top_k?: number,
                top_p?: number,
                top_a?: number,
                typical_p?: number,
                tail_free_sampling?: boolean,
                repetition_penalty?: number,
                repetition_penalty_range?: number,
                repetition_penalty_slope?: number,
                repetition_penalty_frequency?: number,
                repetition_penalty_presence?: number,
                repetition_penalty_default_whitelist?: boolean,
                order?: number[],
            },
            preset?: "default-genesis" | "default-basic-coherence" | "default-ouroboros" | "default-ace-of-spades" | "default-moonlit-chronicler" | "default-fandango" | "default-all-nighter" | "default-low-rider-2" | "default-morpho" | "default-prowriter20",
            trimResponses?: boolean,
            banBrackets?: boolean,
            prefix?: string, // strict string ?
            dynamicPenaltyRange?: boolean,
            prefixMode?: number,
            mode?: number,
            model?: "6B-v4" | "euterpe-v2" | "krake-v2" | "clio-v1" | "genji-jp-6b-v2" | "genji-python-6b", 
        },
        story?: {
            version?: number,
            step?: number,
            datablocks?: {
                nextBlock: number[],
                prevBlock: number,
                origin: string,
                startIndex: number,
                endIndex: number,
                dataFragment: any,
                fragmentIndex: number,
                removedFragment: {
                    data: string,
                    origin: string
                }[],
                chain: boolean
            }[],
            currentBlock?: number,
            fragments?: {
                data: string,
                origin: string
            }[],
        },
        context?: {
            text?: string,
            contextConfig?: {
                prefix?: string,
                suffix?: string,
                tokenBudget?: number,
                reservedTokens?: number,
                budgetPriority?: number,
                trimDirection?: string, // strict string ?
                insertionType?: string, // strict string ?
                maximumTrimType?: string, // strict string ?
                intertionPosition?: number
            }
        }[],
        lorebook?: {
            lorebookVersion?: number,
            entries?: {
                searchRange?: number,
                enabled?: boolean,
                forceActivation?: boolean,
                keyRelative?: boolean,
                nonStoryActivatable?: boolean,
                category?: string,
                loreBiasGroups?: {
                    phrases?: string[],
                    ensureSequenceFinish?: boolean,
                    generateOnce?: boolean,
                    bias?: number,
                    enabled?: boolean,
                    whenInactive?: boolean
                }[],
            }[],
            settings?: {
                orderByKeyLocations?: boolean,
            },
            categories?: any[],
        },
        storyContextConfig?: {
            prefix?: string,
            suffix?: string,
            tokenBudget?: number,
            reservedTokens?: number,
            budgetPriority?: number,
            trimDirection?: string, // strict string ?
            insertionType?: string, // strict string ?
            maximumTrimType?: string, // strict string ?
            intertionPosition?: number,
            allowIntertionInside?: boolean,
        },
        ephemeralContext?: any[],
        contextDefaults?: {
            ephemeralDefaults?: {
                text?: string,
                contextConfig?: {},
                startingStep?: number,
                delay?: number,
                duration?: number,
                repeat?: number,
                reverse?: boolean,
            }[],
            loreDefaults?: {
                text?: string,
                contextConfig?: {
                    prefix?: string,
                    suffix?: string,
                    tokenBudget?: number,
                    reservedTokens?: number,
                    budgetPriority?: number,
                    trimDirection?: string, // strict string ?
                    insertionType?: string, // strict string ?
                    maximumTrimType?: string, // strict string ?
                    intertionPosition?: number
                },
                lastUpdatedAt?: number,
                displayName?: string,
                id?: string,
                keys?: string[],
                searchRange?: number,
                enabled?: boolean,
                forceActivation?: boolean,
                keyRelative?: boolean,
                nonStoryActivatable?: boolean,
                category?: string,
                loreBiasGroups?: {
                    phrases?: string[],
                    ensureSequenceFinish?: boolean,
                    generateOnce?: boolean,
                    bias?: number,
                    enabled?: boolean,
                    whenInactive?: boolean
                }[],
            }[],
        },
        dettingsDirty?: boolean,
        didGenerate?: boolean,
        phraseBiasGroups?: {
            phrases?: string[],
            ensureSequenceFinish?: boolean,
            generateOnce?: boolean,
            bias?: number,
            enabled?: boolean,
            whenInactive?: boolean
        }[],
        bannedSequenceGroups?: {
            sequences?: string[],
            enabled?: boolean,
        }[],
    };
    lastUpdatedAt?: number;
    changeIndex?: number;

    constructor(private ai: NovelAI, data: StoryContent) {
        this.id = data.id;
        this.type = data.type;
        this.meta = data.meta;
        this.data = data.data;
        this.lastUpdatedAt = data.lastUpdatedAt;
        this.changeIndex = data.changeIndex;
    }

}