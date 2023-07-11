import { NovelAI } from "../NovelAI";
import { StoryMetadata } from "./StoryMetadata";

export class Story {

    public readonly id?: string;
    public readonly meta?: string;
    public readonly data?: StoryMetadata;
    public readonly lastUpdatedAt?: number;
    public readonly changeIndex?: number;
    public readonly type?: "stories"

    constructor(private ai: NovelAI, data: Story) {
        this.id = data.id;
        this.meta = data.meta;
        this.data = data.data;
        this.lastUpdatedAt = data.lastUpdatedAt;
        this.changeIndex = data.changeIndex;
        this.type = data.type;
    }

    public async getContent() {
        return this.ai.stories.getContent(this.id);
    }
}