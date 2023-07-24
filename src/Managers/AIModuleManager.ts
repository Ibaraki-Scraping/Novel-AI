import { NovelAI } from "../NovelAI";
import { StoryContent } from "../Structures/StoryContent";

export class AIModuleManager {

    constructor(private ai: NovelAI) {

    }

    public async get(): Promise<{
        id: string,
        type: 'aimodules',
        meta: string,
        data: {
            id: string,
            name: string,
            description: string,
            remoteId: string,
            mode: number,
            image: string
        },
        lastUpdatedAt: number,
        changeIndex: number
    }[]>;
    public async get(id: string): Promise<{
        id: string,
        type: 'aimodules',
        meta: string,
        data: {
            id: string,
            name: string,
            description: string,
            remoteId: string,
            mode: number,
            image: string
        },
        lastUpdatedAt: number,
        changeIndex: number
    }>;
    public async get(id?: string): Promise<any | any[]> {
        let objs = [];
        const res = JSON.parse((await this.ai['fetch']('/user/objects/aimodules' + (id ? "/" + id : ""), {})).body.toString());
        
        if (id) {
            objs.push(res);
        } else {
            objs.push(...res.objects);
        }

        for (let obj of objs) {
            try {
                obj.data = await this.ai['keyStore'].decryptObject(obj);
            } catch (e) {}
        }

        if (id) {
            return objs[0];
        } else {
            return objs;
        }
    }

    public async create(options: {
        name: string,
        description: string,
        remoteId: string,
        mode: number,
        image: string
    }): ReturnType<AIModuleManager['get']> {
        const res = await this.ai['fetch']('/user/objects/aimodules', {
            method: 'POST'
        }, options);

        return await this.get(JSON.parse(res.body.toString()).id);
    }

    public async delete(id: string): Promise<void> {
        await this.ai['fetch']('/user/objects/aimodules/' + id, {
            method: 'DELETE'
        });
    }

    public async train(options: {
        data: string,
        description: string,
        lr?: number,
        model?: typeof StoryContent['prototype']['data']['settings']['model'],
        name: string,
        percentage?: number,
        steps?: number,
    }, updater: (state: {}) => any = ()=>{}): Promise<void> {
        if (!options.model) options.model = '6B-v4';
        if (!options.lr) options.lr = 0.0001;
        if (!options.percentage) options.percentage = options.data.length * 0.8;
        if (!options.steps) options.steps = 1000;

        await this.ai['fetch']('/ai/module/train', {
            method: 'POST'
        }, options);

        const id = (await this.getTrained()).reverse()[0].id;

        await new Promise<void>((resolve) => {
            const x = setInterval(async () => {
                const status = await this.getTrained(id);
                updater(status);
                if (status.status === 'ready') {
                    clearInterval(x);
                    resolve();
                }
            }, 1000);
        });
    }

    public async deleteTrained(id: string): Promise<void> {
        await this.ai['fetch']('/ai/module/' + id, {
            method: 'DELETE'
        });
    }

    public async getTrained(): Promise<{
        data: string,
        description: string,
        id: string,
        lr: number,
        model: typeof StoryContent['prototype']['data']['settings']['model'],
        name: string,
        lastUpdatedAt: number,
        lossHistory: number[],
        status: 'ready' | 'training' | 'pending',
        steps: number
    }[]>
    public async getTrained(id: string): Promise<{
        data: string,
        description: string,
        id: string,
        lr: number,
        model: typeof StoryContent['prototype']['data']['settings']['model'],
        name: string,
        lastUpdatedAt: number,
        lossHistory: number[],
        status: 'ready' | 'training' | 'pending',
        steps: number
    }>
    public async getTrained(id?: string): Promise<any | any[]> {
        return JSON.parse((await this.ai['fetch']('/ai/module/' + (id ? id : 'all'), {})).body.toString());
    }

}