import { crypto_generichash, crypto_pwhash, crypto_pwhash_ALG_ARGON2ID13, crypto_pwhash_SALTBYTES, ready } from "libsodium-wrappers-sumo";
import { NovelAI } from "../NovelAI";
import { TTSManager } from "./TTSManager";

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

    public async getGiftKeys(): Promise<any[]> {
        return JSON.parse((await this.ai['fetch']('/user/giftkeys', {})).body.toString()).giftKeys;
    }

    public async getData(): Promise<{
        priority: Awaited<ReturnType<UserManager['getPriority']>>,
        subsciption: Awaited<ReturnType<UserManager['getSubscription']>>,
        keystore: {
            keystore: string,
        },
        settings: string,
        information: Awaited<ReturnType<UserManager['getUserInfos']>>,
    }> {
        return JSON.parse((await this.ai['fetch']('/user/data', {})).body.toString());
    }

    public async getPriority(): Promise<{
        "maxPriorityActions": number,
        nextRefillAt: number,
        taskPriority: number
    }> {
        return JSON.parse((await this.ai['fetch']('/user/priority', {})).body.toString());
    }

    public async getSettings(): Promise<{
        settingsVersion: number,
        forceModelUpdate: number,
        model: number,
        tutorialSeen: boolean,
        stableLicenseAgree: boolean,
        hideImageStartupModal: boolean,
        subscriptionPurchaseAttempt: number,
        commentAvatar: number,
        lastUpdateViewed: number,
        imageUpdateStatus: number,
        ttsType: number,
        ttsRateStreamed: number,
        ttsV2Seed: Parameters<TTSManager['generate']>[0]['seed'],
        speakOutputs: boolean,
        speakComments: boolean,
        savedTtsSeeds: {
            id: string,
            name: string,
            seed: string,
            model: "v1" | "v2"
        }[]
    }> {
        return JSON.parse((await this.ai['fetch']('/user/clientsettings', {})).body.toString());
    }

    public async editSettings(options: Awaited<ReturnType<UserManager['getSettings']>>): Promise<void> {
        const currentSettings = await this.getSettings();

        if (!options.settingsVersion) options.settingsVersion = currentSettings.settingsVersion;
        if (!options.forceModelUpdate) options.forceModelUpdate = currentSettings.forceModelUpdate;
        if (!options.model) options.model = currentSettings.model;
        if (!options.tutorialSeen) options.tutorialSeen = currentSettings.tutorialSeen;
        if (!options.stableLicenseAgree) options.stableLicenseAgree = currentSettings.stableLicenseAgree;
        if (!options.hideImageStartupModal) options.hideImageStartupModal = currentSettings.hideImageStartupModal;
        if (!options.subscriptionPurchaseAttempt) options.subscriptionPurchaseAttempt = currentSettings.subscriptionPurchaseAttempt;
        if (!options.commentAvatar) options.commentAvatar = currentSettings.commentAvatar;
        if (!options.lastUpdateViewed) options.lastUpdateViewed = currentSettings.lastUpdateViewed;
        if (!options.imageUpdateStatus) options.imageUpdateStatus = currentSettings.imageUpdateStatus;
        if (!options.ttsType) options.ttsType = currentSettings.ttsType;
        if (!options.ttsRateStreamed) options.ttsRateStreamed = currentSettings.ttsRateStreamed;
        if (!options.ttsV2Seed) options.ttsV2Seed = currentSettings.ttsV2Seed;
        if (!options.speakOutputs) options.speakOutputs = currentSettings.speakOutputs;
        if (!options.speakComments) options.speakComments = currentSettings.speakComments;
        if (!options.savedTtsSeeds) options.savedTtsSeeds = currentSettings.savedTtsSeeds;

        await this.ai['fetch']('/user/clientsettings', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        }, options);
    }
}