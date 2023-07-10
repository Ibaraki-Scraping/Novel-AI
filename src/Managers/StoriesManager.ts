import { crypto_secretbox_NONCEBYTES, crypto_secretbox_open_easy } from "libsodium-wrappers-sumo";
import { NovelAI } from "../NovelAI";
import { StoryMetadata } from "../Structures/StoryMetadata";
import { Story } from "../Structures/Story";
import { StoryContent } from "../Structures/StoryContent";
import { Encoder } from "./Tokenizer";

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

    public async delete(id: string): Promise<void> {
        await this.ai['fetch']('/user/objects/stories/' + id, {
            method: 'DELETE'
        });
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

    public async deleteContent(id: string): Promise<void> {
        await this.ai['fetch']('/user/objects/storycontent/' + id, {
            method: 'DELETE'
        });
    }

    public async generatePrompt(options: {
        model?: typeof StoryContent['prototype']['data']['settings']['model'],
        prompt: string,
        temp?: number,
        tokens_to_generate?: number
    }): Promise<string> {
        if (!options.model) options.model = "euterpe-v2";
        if (!options.temp) options.temp = 100;
        if (!options.tokens_to_generate) options.tokens_to_generate = 200;

        const encoder = new Encoder(options.model);

        const bArray = encoder.encode(options.prompt);

        const bytes: number[] = [];
        for (const token of bArray) {
            bytes.push(token & 0xff); // Lower 8 bits
            bytes.push((token >> 8) & 0xff); // Upper 8 bits
        }
        const concatenatedBuffer = Buffer.from(bytes);

        options.prompt = concatenatedBuffer.toString('base64');

        return JSON.parse((await this.ai['fetch']('/ai/generate-prompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, options)).body.toString());
    }

    public async generateStream(options: Parameters<StoriesManager['_generate']>[0], events: (str: string) => any = ()=>{}): Promise<string> {

        const body = await this._generate(({...options, stream: true }) as any);

        const encoder = new Encoder(options.model || "euterpe-v2");

        const res = [];

        for (let data of body.split("\n").filter(e => e.startsWith("data:"))) {
            data = data.replace("data:", "");
            const buffer = Buffer.from(JSON.parse(data).token, 'base64');

            const tokens: number[] = [];
            for (let i = 0; i < buffer.length; i += 2) {
                const lowerByte = buffer[i];
                const upperByte = buffer[i + 1];
                const token = lowerByte | (upperByte << 8);
                tokens.push(token);
            }

            res.push(encoder.decode(tokens));

            events(res[res.length - 1]);
        }

        return res.join("");
    }

    public async generate(options: Parameters<StoriesManager['_generate']>[0]): Promise<string> {
        const body = await this._generate(options);

        const buffer = Buffer.from(JSON.parse(body).output, 'base64');

        const tokens: number[] = [];
        for (let i = 0; i < buffer.length; i += 2) {
            const lowerByte = buffer[i];
            const upperByte = buffer[i + 1];
            const token = lowerByte | (upperByte << 8);
            tokens.push(token);
        }

        const encoder = new Encoder(options.model || "euterpe-v2");
        return encoder.decode(tokens);
    }

    private async _generate(options: {
        input: string,
        model?: typeof StoryContent['prototype']['data']['settings']['model'],
        parameters?: {
            bad_words_ids?: number[][]
            generate_until_sentence?: boolean,
            max_length?: number,
            min_length?: number,
            order?: number[],
            prefix?: string,
            repetition_penalty?: number,
            repetition_penalty_range?: number,
            repetition_penalty_slope?: number,
            repetition_penalty_presence?: number,
            repetition_penalty_frequency?: number,
            return_full_text?: boolean,
            tail_free_sampling?: number,
            temperature?: number,
            top_k?: number,
            top_p?: number,
            use_cache?: boolean,
            use_string?: boolean
        }
    }): Promise<string> {

        if (!options.model) options.model = "euterpe-v2";
        if (!options.parameters) options.parameters = {};
        if (!options.parameters.bad_words_ids) options.parameters.bad_words_ids = [[58],[60],[90],[92],[685],[1391],[1782],[2361],[3693],[4083],[4357],[4895],[5512],[5974],[7131],[8183],[8351],[8762],[8964],[8973],[9063],[11208],[11709],[11907],[11919],[12878],[12962],[13018],[13412],[14631],[14692],[14980],[15090],[15437],[16151],[16410],[16589],[17241],[17414],[17635],[17816],[17912],[18083],[18161],[18477],[19629],[19779],[19953],[20520],[20598],[20662],[20740],[21476],[21737],[22133],[22241],[22345],[22935],[23330],[23785],[23834],[23884],[25295],[25597],[25719],[25787],[25915],[26076],[26358],[26398],[26894],[26933],[27007],[27422],[28013],[29164],[29225],[29342],[29565],[29795],[30072],[30109],[30138],[30866],[31161],[31478],[32092],[32239],[32509],[33116],[33250],[33761],[34171],[34758],[34949],[35944],[36338],[36463],[36563],[36786],[36796],[36937],[37250],[37913],[37981],[38165],[38362],[38381],[38430],[38892],[39850],[39893],[41832],[41888],[42535],[42669],[42785],[42924],[43839],[44438],[44587],[44926],[45144],[45297],[46110],[46570],[46581],[46956],[47175],[47182],[47527],[47715],[48600],[48683],[48688],[48874],[48999],[49074],[49082],[49146],[49946],[10221],[4841],[1427],[2602,834],[29343],[37405],[35780],[2602],[50256]];
        if (!options.parameters.generate_until_sentence) options.parameters.generate_until_sentence = true;
        if (!options.parameters.max_length) options.parameters.max_length = 40;
        if (!options.parameters.min_length) options.parameters.min_length = 1;
        if (!options.parameters.order) options.parameters.order = [2, 1, 3, 0];
        if (!options.parameters.prefix) options.parameters.prefix = "vanilla";
        if (!options.parameters.repetition_penalty) options.parameters.repetition_penalty = 1.148125;
        if (!options.parameters.repetition_penalty_range) options.parameters.repetition_penalty_range = 2048;
        if (!options.parameters.repetition_penalty_slope) options.parameters.repetition_penalty_slope = 0.09;
        if (!options.parameters.repetition_penalty_presence) options.parameters.repetition_penalty_presence = 0;
        if (!options.parameters.repetition_penalty_frequency) options.parameters.repetition_penalty_frequency = 0;
        if (!options.parameters.return_full_text) options.parameters.return_full_text = false;
        if (!options.parameters.tail_free_sampling) options.parameters.tail_free_sampling = 0.975;
        if (!options.parameters.temperature) options.parameters.temperature = 0.63;
        if (!options.parameters.top_k) options.parameters.top_k = 0;
        if (!options.parameters.top_p) options.parameters.top_p = 0.975;
        if (!options.parameters.use_cache) options.parameters.use_cache = false;
        if (!options.parameters.use_string) options.parameters.use_string = false;

        const encoder = new Encoder(options.model);

        const bArray = encoder.encode(options.input);

        const bytes: number[] = [];
        for (const token of bArray) {
            bytes.push(token & 0xff); // Lower 8 bits
            bytes.push((token >> 8) & 0xff); // Upper 8 bits
        }
        const concatenatedBuffer = Buffer.from(bytes);

        options.input = concatenatedBuffer.toString('base64');

        const stream = options['stream'];

        delete options['stream'];

        const {status, body} = await this.ai['fetch']('/ai/generate' + (stream ? "-stream" : ""), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, options);

        if (status !== 201) {
            throw new Error(body.toString());
        }

        return body.toString();
    }

}