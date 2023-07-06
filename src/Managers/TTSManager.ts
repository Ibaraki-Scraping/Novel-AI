import { NovelAI } from "../NovelAI";

export class TTSManager {

    constructor(private ai: NovelAI) {

    }

    public async generate(options: {
        text: string,
        voice?: number,
        seed?: "Naia" | "Ligeia" | "Aini" | "Orea" | "Claea" | "Lim" | "Aurae" | "Aulon" | "Elei" | "Ogma" | "Raid" | "Pega" | "Lam",
        opus?: boolean,
        version?: 1 | 2
    }): Promise<Buffer> {
            
        if (!options.voice) options.voice = -1;
        if (!options.seed) options.seed = "Naia";
        if (!options.opus) options.opus = false;
        if (!options.version) options.version = 2;

        const {status, body} = await this.ai['fetch']('/ai/generate-voice?text=' + encodeURIComponent(options.text) + '"&voice=' + options.voice + "&seed=" + options.seed + "&opus=" + options.opus + "&version=v" + options.version, {});

        if (status !== 200) {
            throw new Error(body.toString());
        } else {
            return body;
        }
}

}