import { crypto_generichash, crypto_pwhash, crypto_pwhash_ALG_ARGON2ID13, crypto_pwhash_SALTBYTES, ready } from "libsodium-wrappers-sumo";
import { NovelAI } from "../NovelAI";

export class UserManager {
    
    constructor(private ai: NovelAI) {

    }

    public async login(email: string, password: string): Promise<void> {
        await ready;
        const token = crypto_pwhash(
            64,
            new Uint8Array(Buffer.from(password)),
            crypto_generichash(
                crypto_pwhash_SALTBYTES,
                password.slice(0, 6) + email + 'novelai_data_access_key',
            ),
            2,
            2e6,
            crypto_pwhash_ALG_ARGON2ID13,
            'base64'
        ).slice(0, 64);

        const crypt_token = crypto_pwhash(
            128,
            new Uint8Array(Buffer.from(password)),
            crypto_generichash(
                crypto_pwhash_SALTBYTES,
                password.slice(0, 6) + email + "novelai_data_encryption_key"
            ), 
            2, 
            2e6, 
            crypto_pwhash_ALG_ARGON2ID13,
            "base64"
        )
    
        const {status, body} = await this.ai['fetch']('/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, {
            key: token
        });

        if (status !== 201) {
            throw new Error(body.toString());
        } else {
            this.ai['token'] = JSON.parse(body.toString()).accessToken;
            this.ai['decryptToken'] = crypt_token;

            await this.ai['keyStore']['decryptKeyStore']();
        }
    }

    public async getSubscription(): Promise<{
        "tier": 0 | 1 | 2 | 3,
        "active": boolean,
        "expiresAt": number,
        "perks": {
            "maxPriorityActions": number,
            "startPriority": number,
            "moduleTrainingSteps": number,
            "unlimitedMaxPriority": boolean,
            "voiceGeneration": boolean,
            "imageGeneration": boolean,
            "unlimitedImageGeneration": boolean,
            "unlimitedImageGenerationLimits": any[],
            "contextTokens": number
        },
        "trainingStepsLeft": {
            "fixedTrainingStepsLeft": number,
            "purchasedTrainingSteps": number
        },
        "accountType": number
    }> {
        return JSON.parse((await this.ai['fetch']('/user/subscription', {})).body.toString());
    }

    public async getUserInfos(): Promise<{
        emailVerified: boolean,
        emailVerificationLettersSent: number,
        trialActivated: boolean,
        trialActionsLeft: number,
        accountCreatedAt: number
    }> {
        return JSON.parse((await this.ai['fetch']('/user/information', {})).body.toString());
    }

}