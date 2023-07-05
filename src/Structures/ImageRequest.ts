export interface ImageRequest {
    input: string,
    model?: "nai-diffusion" | "safe-diffusion" | "nai-diffusuin-furry",
    action?: "generate",
    parameters?: {
        width?: 512 | 640 | 768 | 832 | 1024 | 1088 | 1280 | 1472 | 1536 | 1920,
        height?: 512 | 640 | 768 | 832 | 1024 | 1088 | 1280 | 1472 | 1536 | 1920,
        scale?: number,
        sampler?: 'k_euler' | 'k_euler_ancestral' | 'k_heun' | 'k_dpm_2' | 'k_dpm_2_ancestral' | 'k_lms' | 'nai_smea' | 'nai_smea_dyn' | 'k_dpm_fast' | 'k_dpm_adaptive' | 'k_dpmpp_2s_ancestral' | 'k_dpmpp_2m' | 'k_dpmpp_sde' | 'ddim'
        steps?: number,
        seed?: number,
        n_samples?: number,
        ucPreset?: number,
        qualityToggle?: boolean,
        nagative_prompt?: string,
    }
}