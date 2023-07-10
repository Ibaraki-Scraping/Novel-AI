import { v4 } from "uuid";
import { NovelAI } from "../NovelAI";

export class ShelfManager {

    constructor(private ai: NovelAI) {

    }

    get(id: string): Promise<{
        changeIndex: number,
        data: {
            storyMetadataVersion: number,
            id: string,
            title: string,
            description: string,
            textPreview: string,
            isTA: boolean,
            favorite: boolean,
            tags: string[],
            createdAt: number,
            lastUpdatedAt: number,
            idModified: boolean
        },
        id: string,
        lastUpdatedAt: number,
        meta: string,
        type: 'shelf'
    }>
    get(): Promise<{
        changeIndex: number,
        data: {
            storyMetadataVersion: number,
            id: string,
            title: string,
            description: string,
            textPreview: string,
            isTA: boolean,
            favorite: boolean,
            tags: string[],
            createdAt: number,
            lastUpdatedAt: number,
            idModified: boolean
        },
        id: string,
        lastUpdatedAt: number,
        meta: string,
        type: 'shelf'
    }[]>
    public async get(id?: string) {
        let objs = [];
        const res = JSON.parse((await this.ai['fetch']('/user/objects/shelf' + (id ? "/" + id : ""), {})).body.toString());
        
        if (id) {
            objs.push(res);
        } else {
            objs.push(...res.objects);
        }

        for (let obj of objs) {
            obj.data = JSON.parse(Buffer.from(obj.data, 'base64').toString());
        }

        if (id) {
            return objs[0];
        } else {
            return objs;
        }
    }

    public async create(options: {
        data: {
            storyMetadataVersion?: number,
            id?: string,
            title: string,
            description?: string,
            textPreview?: string,
            isTA?: boolean,
            favorite?: boolean,
            tags?: string[],
            createdAt?: number,
            lastUpdatedAt?: number,
            idModified?: boolean
        }
    }): Promise<Awaited<ReturnType<typeof this.get>>[0]> {

        if (!options.data.storyMetadataVersion) options.data.storyMetadataVersion = 1;
        if (!options.data.id) options.data.id = v4();
        if (!options.data.description) options.data.description = "";
        if (!options.data.textPreview) options.data.textPreview = "";
        if (!options.data.isTA) options.data.isTA = false;
        if (!options.data.favorite) options.data.favorite = false;
        if (!options.data.tags) options.data.tags = [];
        options.data.createdAt = Date.now();
        options.data.lastUpdatedAt = Date.now();
        options.data.idModified = false;

        const res = JSON.parse((await this.ai['fetch']('/user/objects/shelf', {
            method: 'PUT'
        }, {
            ...options,
            meta: v4(),
            data: Buffer.from(JSON.stringify(options.data)).toString('base64')
        })).body.toString());
        return await this.get(res.id);
    }

    public async update(id: string, options: Parameters<typeof this.create>[0]): Promise<Awaited<ReturnType<typeof this.get>>[0]> {
        const obj = await this.get(id);

        if (!options.data.storyMetadataVersion) options.data.storyMetadataVersion = obj.data.storyMetadataVersion;
        if (!options.data.id) options.data.id = obj.data.id;
        if (!options.data.description) options.data.description = obj.data.description;
        if (!options.data.textPreview) options.data.textPreview = obj.data.textPreview;
        if (!options.data.isTA) options.data.isTA = obj.data.isTA;
        if (!options.data.favorite) options.data.favorite = obj.data.favorite;
        if (!options.data.tags) options.data.tags = obj.data.tags;
        options.data.createdAt = obj.data.createdAt;
        options.data.lastUpdatedAt = Date.now();
        options.data.idModified = obj.data.idModified;

        await this.ai['fetch']('/user/objects/shelf/' + id, {
            method: 'PATCH'
        }, {
            meta: v4(),
            data: Buffer.from(JSON.stringify(options)).toString('base64'),
        });
        return await this.get(id);
    }

    public async delete(id: string): Promise<void> {
        await this.ai['fetch']('/user/objects/shelf/' + id, {
            method: 'DELETE'
        });
    }

}