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
    }): Promise<Awaited<ReturnType<typeof this.get>>[0]> {

        if (!options.storyMetadataVersion) options.storyMetadataVersion = 1;
        if (!options.id) options.id = v4();
        if (!options.description) options.description = "";
        if (!options.textPreview) options.textPreview = "";
        if (!options.isTA) options.isTA = false;
        if (!options.favorite) options.favorite = false;
        if (!options.tags) options.tags = [];
        options.createdAt = Date.now();
        options.lastUpdatedAt = Date.now();
        options.idModified = false;

        const res = JSON.parse((await this.ai['fetch']('/user/objects/shelf', {
            method: 'PUT'
        }, {
            meta: v4(),
            data: Buffer.from(JSON.stringify(options)).toString('base64')
        })).body.toString());
        return await this.get(res.id);
    }

    public async update(id: string, options: Parameters<typeof this.create>[0]): Promise<Awaited<ReturnType<typeof this.get>>[0]> {
        const obj = await this.get(id);

        if (!options.storyMetadataVersion) options.storyMetadataVersion = obj.data.storyMetadataVersion;
        if (!options.id) options.id = obj.data.id;
        if (!options.description) options.description = obj.data.description;
        if (!options.textPreview) options.textPreview = obj.data.textPreview;
        if (!options.isTA) options.isTA = obj.data.isTA;
        if (!options.favorite) options.favorite = obj.data.favorite;
        if (!options.tags) options.tags = obj.data.tags;
        options.createdAt = obj.data.createdAt;
        options.lastUpdatedAt = Date.now();
        options.idModified = obj.data.idModified;

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