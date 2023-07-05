import { crypto_secretbox_NONCEBYTES, crypto_secretbox_open_easy } from "libsodium-wrappers-sumo";
import { NovelAI } from "../NovelAI";
import { StoryMetadata } from "../Structures/StoryMetadata";
import { Story } from "../Structures/Story";
import { StoryContent } from "../Structures/StoryContent";

export class StoriesManager {

    constructor(private ai: NovelAI) {

    }

    get(id: string): Promise<Story>
    get(): Promise<Story[]>
    public async get(id?: string) {
        let objs = [];
        const res = JSON.parse((await this.ai['fetch']('/user/objects/stories' + (id ? "/" + id : ""), {})).body.toString());
        
        if (id) {
            objs.push(res);
        } else {
            objs.push(...res.objects);
        }

        for (let obj of objs) {
            obj.data = await this.ai['keyStore'].decryptObject(obj);
        }

        objs = objs.map((obj) => new Story(this.ai, obj));

        if (id) {
            return objs[0];
        } else {
            return objs;
        }
    }

    getContent(id: string): Promise<StoryContent>
    getContent(): Promise<StoryContent[]>
    public async getContent(id?: string) {
        let objs = [];
        const res = JSON.parse((await this.ai['fetch']('/user/objects/storycontent' + (id ? "/" + id : ""), {})).body.toString());
        if (id) {
            objs.push(res);
        } else {
            objs.push(...res.objects);
        }

        for (let obj of objs) {
            obj.data = await this.ai['keyStore'].decompressDecryptObject(obj);
        }

        objs = objs.map((obj) => new StoryContent(this.ai, obj));

        if (id) {
            return objs[0];
        } else {
            return objs;
        }
    }

}