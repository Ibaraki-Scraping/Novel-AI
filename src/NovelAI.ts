import AdmZip = require("adm-zip");
import { getRandomValues, subtle } from "crypto";
import { RequestOptions, request } from "https";
import { crypto_generichash, crypto_pwhash, crypto_pwhash_ALG_ARGON2ID13, crypto_pwhash_SALTBYTES, crypto_secretbox_NONCEBYTES, crypto_secretbox_easy, crypto_secretbox_keygen, crypto_secretbox_open_easy, randombytes_buf, ready } from "libsodium-wrappers-sumo";
import { UserManager } from "./Managers/UserManager";
import { ImageManager } from "./Managers/ImageManager";
import { TTSManager } from "./Managers/TTSManager";
import { KeyStoreManager } from "./Managers/KeyStore";
import { StoriesManager } from "./Managers/StoriesManager";
import { ShelfManager } from "./Managers/ShelfManager";
import { AIModuleManager } from "./Managers/AIModuleManager";
import { PresetManager } from "./Managers/PresetManager";

export class NovelAI {

    private token: string;
    private decryptToken: string;

    public readonly user = new UserManager(this);

    public readonly images = new ImageManager(this);

    public readonly tts = new TTSManager(this);

    public readonly stories = new StoriesManager(this);

    public readonly shelves = new ShelfManager(this);

    public readonly modules = new AIModuleManager(this);

    public readonly presets = new PresetManager(this);

    private readonly keyStore = new KeyStoreManager(this);

    private fetch(url: string, options: RequestOptions, body?: any): Promise<{status: number, body: Buffer}> {
        return new Promise((resolve, reject) => {
            const req = request({
                hostname: 'api.novelai.net',
                path: url,
                method: 'GET',
                ...options,
                headers: {
                    ...options.headers,
                    authorization: this.token ? `Bearer ${this.token}` : ""
                }
            }, (res) => {
                let data: Buffer = Buffer.alloc(0);

                res.on('data', (chunk) => {
                    data = Buffer.concat([data, chunk]);
                });

                res.on('end', () => {
                    resolve({
                        status: res.statusCode,
                        body: data
                    });
                });
            });
    
            if (body) {
                req.write(JSON.stringify(body));
            }

            req.end();
        });
        
    }

}