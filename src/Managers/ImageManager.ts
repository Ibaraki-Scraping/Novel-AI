import AdmZip = require("adm-zip");
import { NovelAI } from "../NovelAI";
import { ImageRequest } from "../Structures/ImageRequest";
import { SuggestedTag } from "../Structures/SuggestedTag";

export class ImageManager {

    constructor(private ai: NovelAI) {

    }

    public async getSuggestedTags(options: {
        model: "nai-diffusion" | "safe-diffusion" | "nai-diffusuin-furry",
        prompt: string
    }): Promise<SuggestedTag[]> {
        return JSON.parse((await this.ai['fetch']('/ai/generate-image/suggest-tags?model=' + options.model + "&prompt=" + encodeURIComponent(options.prompt), {})).body.toString()).tags;
    }

    public async generate(options: ImageRequest = {input: ""}): Promise<Buffer> {

        if (!options.model) options.model = "nai-diffusion";
        if (!options.action) options.action = "generate";
        if (!options.parameters) options.parameters = {};
        if (!options.parameters.width) options.parameters.width = 512;
        if (!options.parameters.height) options.parameters.height = 768;
        if (!options.parameters.scale) options.parameters.scale = 11;
        if (!options.parameters.sampler) options.parameters.sampler = "k_euler_ancestral";
        if (!options.parameters.steps) options.parameters.steps = 28;
        if (!options.parameters.seed) options.parameters.seed = Math.floor(Math.random() * 1000000);
        if (!options.parameters.n_samples) options.parameters.n_samples = 1;
        if (!options.parameters.ucPreset) options.parameters.ucPreset = 0;
        if (!options.parameters.qualityToggle) options.parameters.qualityToggle = true;
        if (!options.parameters.nagative_prompt) options.parameters.nagative_prompt = "nsfw, nude, nudity, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry";

        const {status, body} = await this.ai['fetch']('/ai/generate-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, options);

        if (status !== 200) {
            throw new Error(body.toString());
        } else {
            const zip = new AdmZip(body);
            return zip.getEntries()[0].getData();
        }
    }

    public async upscale(options: {
        height: number,
        image: Buffer,
        scale: number,
        width: number
    }): Promise<Buffer> {
        const {status, body} = await this.ai['fetch']('/ai/upscale', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, {...options, image: options.image.toString('base64')});

        if (status !== 200) {
            throw new Error(body.toString());
        } else {
            const zip = new AdmZip(body);
            return zip.getEntries()[0].getData();
        }
    }

}