import { crypto_generichash, crypto_secretbox_NONCEBYTES, crypto_secretbox_open_easy } from "libsodium-wrappers-sumo";
import { NovelAI } from "../NovelAI";
import { gunzipSync, inflate, inflateRawSync } from "zlib";
import { Inflate, inflateRaw } from "pako";

export class KeyStoreManager {

    private keyStore: {[k: string]: number[]};
    private finished: boolean = false;

    constructor(private ai: NovelAI) {}

    private async getKeyStore() {
        return JSON.parse((await this.ai['fetch']('/user/keystore', {})).body.toString()).keystore;
    }

    private async decryptKeyStore() {
        const ks = await this.getKeyStore();
        const key = this.ai['decryptToken'].replace("=", "");

        if (!ks) {
            
        }

        const json = JSON.parse(Buffer.from(ks, 'base64').toString());

        this.keyStore = JSON.parse(
            new TextDecoder()
            .decode(
                crypto_secretbox_open_easy(
                    new Uint8Array(json.sdata), 
                    new Uint8Array(json.nonce), 
                    crypto_generichash(32, key)
                )
            )
        ).keys;

        this.finished = true;
    }

    public async ready() {
        return new Promise<void>((resolve, reject) => {
            const x = setInterval(() => {
                if (this.finished) {
                    clearInterval(x);
                    resolve();
                }
            });
        });
    }

    public async get(key: string) {
        await this.ready();

        return this.keyStore[key];
    }

    public async decryptObject(obj: {
        meta: string,
        data: string
    }) {
        const r = await this.ai['keyStore'].get(obj.meta);
        const i = new Uint8Array(Buffer.from(obj.data, 'base64'));
        const o = new Uint8Array(i.slice(0, crypto_secretbox_NONCEBYTES));
        const a = new Uint8Array(i.slice(crypto_secretbox_NONCEBYTES));
        const s = crypto_secretbox_open_easy(a, o, new Uint8Array(r));
        const txt = new TextDecoder().decode(s);
        return JSON.parse(txt);
    }

    public async decompressDecryptObject(obj: {
        meta: string,
        data: string
    }) {
        const r = await this.ai['keyStore'].get(obj.meta);
        const i = new Uint8Array(Buffer.from(obj.data, 'base64')).slice(16);
        const o = new Uint8Array(i.slice(0, crypto_secretbox_NONCEBYTES));
        const a = new Uint8Array(i.slice(crypto_secretbox_NONCEBYTES));
        const s = crypto_secretbox_open_easy(a, o, new Uint8Array(r));
        const inf = new Inflate({
            windowBits: -15,
            to: "string",
            chunkSize: 16384
        });
        inf.push(s, true)
        const decompress = inf.result;

        return JSON.parse(decompress.toString());
    }

}