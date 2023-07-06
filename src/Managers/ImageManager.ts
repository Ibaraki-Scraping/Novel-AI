import AdmZip = require("adm-zip");
import { NovelAI } from "../NovelAI";
import { ImageRequest } from "../Structures/ImageRequest";
import { SuggestedTag } from "../Structures/SuggestedTag";
import { ArgumentTypes } from "../Types";

export class ImageManager {

    constructor(private ai: NovelAI) {

    }

    public async getSuggestedTags(options: {
        model: "nai-diffusion" | "safe-diffusion" | "nai-diffusuin-furry",
        prompt: string
    }): Promise<SuggestedTag[]> {
        return JSON.parse((await this.ai['fetch']('/ai/generate-image/suggest-tags?model=' + options.model + "&prompt=" + encodeURIComponent(options.prompt), {})).body.toString()).tags;
    }

    public async generate(options: Omit<ImageRequest, 'action'> & {parameters?: {n_samples: 1 | undefined}}): Promise<Buffer>
    public async generate(options: Omit<ImageRequest, 'action'> & {parameters?: {n_samples: number}}): Promise<Buffer[]>
    public async generate(options: Omit<ImageRequest, 'action'>): Promise<Buffer | Buffer[]>
    public async generate(options: ImageRequest): Promise<Buffer | Buffer[]> {

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
            const entries = zip.getEntries();
            if (entries.length === 1) {
                return entries[0].getData();
            }
            return entries.map(entry => entry.getData());
        }
    }

    public async enhance(options: Omit<ImageRequest, 'action'> & {parameters: {add_original_image?: boolean, controlnet_strength?: number, dynamic_thresholding?: boolean, extra_noise_seed?: number, image: Buffer, legacy?: boolean, noise?: number, sm?: boolean, sm_dyn?: boolean, strength?: number, n_samples: number}}): Promise<Buffer[]>
    public async enhance(options: Omit<ImageRequest, 'action'> & {parameters: {add_original_image?: boolean, controlnet_strength?: number, dynamic_thresholding?: boolean, extra_noise_seed?: number, image: Buffer, legacy?: boolean, noise?: number, sm?: boolean, sm_dyn?: boolean, strength?: number, n_samples: 1 | undefined}}): Promise<Buffer>
    public async enhance(options: Omit<ImageRequest, 'action'> & {parameters: {add_original_image?: boolean, controlnet_strength?: number, dynamic_thresholding?: boolean, extra_noise_seed?: number, image: Buffer, legacy?: boolean, noise?: number, sm?: boolean, sm_dyn?: boolean, strength?: number}}): Promise<Buffer | Buffer[]>
    public async enhance(options: ImageRequest & {parameters: {add_original_image?: boolean, controlnet_strength?: number, dynamic_thresholding?: boolean, extra_noise_seed?: number, image: Buffer, legacy?: boolean, noise?: number, sm?: boolean, sm_dyn?: boolean, strength?: number}}): Promise<Buffer | Buffer[]> {
        if (!options.model) options.model = "nai-diffusion";
        if (!options.action) options.action = "img2img";
        if (!options.parameters) options.parameters = {image: undefined};
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
        if (!options.parameters.add_original_image) options.parameters.add_original_image = false;
        if (!options.parameters.controlnet_strength) options.parameters.controlnet_strength = 1;
        if (!options.parameters.dynamic_thresholding) options.parameters.dynamic_thresholding = false;
        if (!options.parameters.extra_noise_seed) options.parameters.extra_noise_seed = Math.floor(Math.random() * 1000000000);
        if (!options.parameters.legacy) options.parameters.legacy = false;
        if (!options.parameters.noise) options.parameters.noise = 0;
        if (!options.parameters.sm) options.parameters.sm = false;
        if (!options.parameters.sm_dyn) options.parameters.sm_dyn = false;
        if (!options.parameters.strength) options.parameters.strength = 0.5;

        const {status, body} = await this.ai['fetch']('/ai/generate-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, {...options, parameters: {...options.parameters, image: options.parameters.image.toString('base64')}});

        if (status !== 200) {
            throw new Error(body.toString());
        } else {
            const zip = new AdmZip(body);
            const entries = zip.getEntries();
            if (entries.length === 1) {
                return entries[0].getData();
            }
            return entries.map(entry => entry.getData());
        }
    }

    public async createVariations(options: ArgumentTypes<typeof this.enhance>[0] & {parameters?: {n_samples: 1 | undefined}}): Promise<Buffer>
    public async createVariations(options: ArgumentTypes<typeof this.enhance>[0] & {parameters?: {n_samples: number}}): Promise<Buffer[]>
    public async createVariations(options: ArgumentTypes<typeof this.enhance>[0]): Promise<Buffer | Buffer[]>
    public async createVariations(options: ArgumentTypes<typeof this.enhance>[0] & {action?: string}): Promise<Buffer | Buffer[]> {

        if (!options.model) options.model = "nai-diffusion";
        if (!options.action) options.action = "img2img";
        if (!options.parameters) options.parameters = {image: undefined};
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
        if (!options.parameters.add_original_image) options.parameters.add_original_image = false;
        if (!options.parameters.controlnet_strength) options.parameters.controlnet_strength = 1;
        if (!options.parameters.dynamic_thresholding) options.parameters.dynamic_thresholding = false;
        if (!options.parameters.extra_noise_seed) options.parameters.extra_noise_seed = Math.floor(Math.random() * 1000000000);
        if (!options.parameters.legacy) options.parameters.legacy = false;
        if (!options.parameters.noise) options.parameters.noise = 0;
        if (!options.parameters.sm) options.parameters.sm = false;
        if (!options.parameters.sm_dyn) options.parameters.sm_dyn = false;
        if (!options.parameters.strength) options.parameters.strength = 0.5;

        const {status, body} = await this.ai['fetch']('/ai/generate-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, {...options, parameters: {...options.parameters, image: options.parameters.image.toString('base64')}});

        if (status !== 200) {
            throw new Error(body.toString());
        } else {
            const zip = new AdmZip(body);
            const entries = zip.getEntries();
            if (entries.length === 1) {
                return entries[0].getData();
            }
            return entries.map(entry => entry.getData());
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

    public async getMask(options: {
        model: "hed" | "midas" | "fake_scribble" | "mlsd" | "uniformer",
        parameters: {
            image: Buffer
        }
    }): Promise<Buffer> {
        const {status, body} = await this.ai['fetch']('/ai/annotate-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, {...options, parameters: {...options.parameters, image: options.parameters.image.toString('base64')}});

        if (status !== 200) {
            throw new Error(body.toString());
        } else {
            const zip = new AdmZip(body);
            return zip.getEntries()[0].getData();
        }
    }

}