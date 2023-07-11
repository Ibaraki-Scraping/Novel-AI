import { crypto_generichash, crypto_secretbox_NONCEBYTES, crypto_secretbox_easy, crypto_secretbox_keygen, crypto_secretbox_open_easy, randombytes_buf } from "libsodium-wrappers-sumo";
import { NovelAI } from "../NovelAI";
import { gunzipSync, inflate, inflateRawSync } from "zlib";
import { Deflate, Inflate, inflateRaw } from "pako";

export class KeyStoreManager {

    private keyStore: {[k: string]: number[]};
    private finished: boolean = false;

    constructor(private ai: NovelAI) {}

    private async getKeyStore(): Promise<{keystore: string, changeIndex: number}> {
        return JSON.parse((await this.ai['fetch']('/user/keystore', {})).body.toString());
    }

    private async saveKeyStore() {
        const current = await this.getKeyStore();
        const ks = await this.encryptKeyStore();
        await this.ai['fetch']('/user/keystore', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            }
        }, {
            keystore: ks,
            changeIndex: current.changeIndex
        });
    }

    private async decryptKeyStore() {
        const ks = await this.getKeyStore();
        const key = this.ai['decryptToken'].replace("=", "");

        if (!ks) {
            
        }

        const json = JSON.parse(Buffer.from(ks.keystore, 'base64').toString());

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

    private async encryptKeyStore() {
        const key = this.ai['decryptToken'].replace("=", "");

        if (!this.keyStore) {
            
        }

        const json = JSON.stringify({
            keys: this.keyStore
        });

        const nonce = crypto_generichash(24, key);

        const sdata = crypto_secretbox_easy(
            new TextEncoder().encode(json),
            nonce,
            crypto_generichash(32, key)
        );

        return Buffer.from(JSON.stringify({
            sdata: Array.from(sdata),
            nonce: Array.from(nonce)
        })).toString('base64');
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

        let val = this.keyStore[key];

        if (!val) {
            this.keyStore[key] = [...crypto_secretbox_keygen()];
            await this.saveKeyStore();
        }

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

    public async encryptObject(obj: {
        meta: string,
        data: any
    }) {
        const r = await this.ai['keyStore'].get(obj.meta);
        const nonce = crypto_generichash(24, new TextEncoder().encode(obj.meta));
        const sdata = crypto_secretbox_easy(
            new TextEncoder().encode(JSON.stringify(obj.data)),
            nonce,
            new Uint8Array(r)
        );

        return Buffer.from(Array.from(nonce).concat(Array.from(sdata))).toString('base64');
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

        return {
            ...JSON.parse(decompress.toString()),
            nonce: o
        };
    }

    public async encryptCompressObject(obj: {
        meta: string,
        data: any,
        nonce?: Uint8Array
    }) {
        const key = await this.ai['keyStore'].get(obj.meta);
        const nonce = randombytes_buf(crypto_secretbox_NONCEBYTES);
        
        obj.data = new TextEncoder().encode(JSON.stringify(obj.data));

        const def = new Deflate({
            windowBits: -15,
            chunkSize: 16384
        });

        def.push(obj.data, true);

        const compressedData = def.result;
        
        obj.data = crypto_secretbox_easy(
            compressedData,
            nonce,
            new Uint8Array(key)
        )

        const COMPRESSION_PREFIX = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
        obj.data = new Uint8Array([...COMPRESSION_PREFIX, ...nonce, ...obj.data]);

        return Buffer.from(obj.data).toString('base64');
    }

    public async decompressObject(obj: {
        data: string
    }) {
        const i = new Uint8Array(Buffer.from(obj.data, 'base64')).slice(16);

        const inf = new Inflate({
            windowBits: -15,
            to: "string",
            chunkSize: 16384
        });
        inf.push(i, true)
        const decompress = inf.result;

        return JSON.parse(decompress.toString());
    }

}