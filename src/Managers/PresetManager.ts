import { v4 } from "uuid";
import { NovelAI } from "../NovelAI";
import { StoryContent } from "../Structures/StoryContent";

export class PresetManager {

    constructor(private ai: NovelAI) {

    }

    get(id: string): Promise<{
        changeIndex: number,
        data: {
            presetVersion: number,
            name: string,
            id: string,
            remoteId: string,
            parameters: {
                max_length: number,
                min_length: number,
                order: {
                    id: string,
                    enabled: boolean,
                }[],
                repetition_penalty: number,
                repetition_penalty_default_whitelist: boolean,
                repetition_penalty_frequency: number,
                repetition_penalty_presence: number,
                repetition_penalty_range: number,
                repetition_penalty_slope: number,
                tail_free_sampling: number,
                temperature: number,
                textGenerationSettingsVersion: number,
                top_a: number,
                top_k: number,
                top_p: number,
                typical_p: number
            },
            model: typeof StoryContent['prototype']['data']['settings']['model']
        },
        id: string,
        lastUpdatedAt: number,
        meta: string,
        type: 'presets'
    }>
    get(): Promise<{
        changeIndex: number,
        data: {
            presetVersion: number,
            name: string,
            id: string,
            remoteId: string,
            parameters: {
                max_length: number,
                min_length: number,
                order: {
                    id: string,
                    enabled: boolean,
                }[],
                repetition_penalty: number,
                repetition_penalty_default_whitelist: boolean,
                repetition_penalty_frequency: number,
                repetition_penalty_presence: number,
                repetition_penalty_range: number,
                repetition_penalty_slope: number,
                tail_free_sampling: number,
                temperature: number,
                textGenerationSettingsVersion: number,
                top_a: number,
                top_k: number,
                top_p: number,
                typical_p: number
            },
            model: typeof StoryContent['prototype']['data']['settings']['model']
        },
        id: string,
        lastUpdatedAt: number,
        meta: string,
        type: 'presets'
    }[]>
    public async get(id?: string) {
        let objs = [];
        const res = JSON.parse((await this.ai['fetch']('/user/objects/presets' + (id ? "/" + id : ""), {})).body.toString());
        
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
        presetVersion?: number,
        name: string,
        id?: string,
        remoteId?: string,
        parameters?: {
            max_length?: number,
            min_length?: number,
            order?: {
                id: string,
                enabled: boolean,
            }[],
            repetition_penalty?: number,
            repetition_penalty_default_whitelist?: boolean,
            repetition_penalty_frequency?: number,
            repetition_penalty_presence?: number,
            repetition_penalty_range?: number,
            repetition_penalty_slope?: number,
            tail_free_sampling?: number,
            temperature?: number,
            textGenerationSettingsVersion?: number,
            top_a?: number,
            top_k?: number,
            top_p?: number,
            typical_p?: number
        },
        model?: typeof StoryContent['prototype']['data']['settings']['model']
    }): Promise<Awaited<ReturnType<typeof this.get>>[0]> {

        if (!options.presetVersion) options.presetVersion = 3;
        if (!options.id) options.id = v4();
        if (!options.remoteId) options.remoteId = "";
        if (!options.model) options.model = "euterpe-v2";
        if (!options.parameters) options.parameters = {};
        if (!options.parameters.max_length) options.parameters.max_length = 75;
        if (!options.parameters.min_length) options.parameters.min_length = 1;
        if (!options.parameters.order) options.parameters.order = [
            {
                "id": "top_k",
                "enabled": true
            },
            {
                "id": "temperature",
                "enabled": true
            },
            {
                "id": "tfs",
                "enabled": true
            },
            {
                "id": "top_p",
                "enabled": false
            },
            {
                "id": "top_a",
                "enabled": false
            },
            {
                "id": "typical_p",
                "enabled": false
            }
        ];
        if (!options.parameters.repetition_penalty) options.parameters.repetition_penalty = 3.8;
        if (!options.parameters.repetition_penalty_default_whitelist) options.parameters.repetition_penalty_default_whitelist = false;
        if (!options.parameters.repetition_penalty_frequency) options.parameters.repetition_penalty_frequency = 0;
        if (!options.parameters.repetition_penalty_presence) options.parameters.repetition_penalty_presence = 0;
        if (!options.parameters.repetition_penalty_range) options.parameters.repetition_penalty_range = 404;
        if (!options.parameters.repetition_penalty_slope) options.parameters.repetition_penalty_slope = 0.84;
        if (!options.parameters.tail_free_sampling) options.parameters.tail_free_sampling = 0.925;
        if (!options.parameters.temperature) options.parameters.temperature = 2.05;
        if (!options.parameters.textGenerationSettingsVersion) options.parameters.textGenerationSettingsVersion = 3;
        if (!options.parameters.top_a) options.parameters.top_a = 1;
        if (!options.parameters.top_k) options.parameters.top_k = 264;
        if (!options.parameters.top_p) options.parameters.top_p = 1;
        if (!options.parameters.typical_p) options.parameters.typical_p = 1;

        const res = JSON.parse((await this.ai['fetch']('/user/objects/presets', {
            method: 'PUT'
        }, {
            meta: v4(),
            data: Buffer.from(JSON.stringify(options)).toString('base64')
        })).body.toString());
        return await this.get(res.id);
    }

    public async update(id: string, options: Parameters<typeof this.create>[0]): Promise<Awaited<ReturnType<typeof this.get>>[0]> {
        const obj = await this.get(id);

        if (!options.presetVersion) options.presetVersion = obj.data.presetVersion;
        if (!options.id) options.id = obj.data.id;
        if (!options.remoteId) options.remoteId = obj.data.remoteId;
        if (!options.model) options.model = obj.data.model;
        if (!options.parameters) options.parameters = obj.data.parameters;

        await this.ai['fetch']('/user/objects/presets/' + id, {
            method: 'PATCH'
        }, {
            meta: v4(),
            data: Buffer.from(JSON.stringify(options)).toString('base64'),
        });
        return await this.get(id);
    }

    public async delete(id: string): Promise<void> {
        await this.ai['fetch']('/user/objects/presets/' + id, {
            method: 'DELETE'
        });
    }

}