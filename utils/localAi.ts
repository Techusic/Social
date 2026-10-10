import * as FileSystem from 'expo-file-system/legacy';
import { initLlama, type LlamaContext } from 'llama.rn';
import type { NPCProfile } from '../types/feed';

const MODEL_URL = 'https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf?download=true';
const MODEL_NAME = 'qwen2.5-0.5b-instruct-q4_k_m.gguf';
const STOP_WORDS = ['</s>', '<|end|>', '<|eot_id|>', '<|end_of_text|>', '<|im_end|>', '<|end_of_turn|>'];

let contextPromise: Promise<LlamaContext> | undefined;
export type LocalAiStatus = 'fallback' | 'loading' | 'ready' | 'error';
let status: LocalAiStatus = 'fallback';
const listeners = new Set<(value: LocalAiStatus) => void>();

function setStatus(value: LocalAiStatus): void {
  status = value;
  listeners.forEach((listener) => listener(value));
}

export function getLocalAiStatus(): LocalAiStatus {
  return status;
}

export function subscribeLocalAiStatus(listener: (value: LocalAiStatus) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function modelPath(): string {
  if (!FileSystem.documentDirectory) throw new Error('Local model storage is unavailable on this device.');
  return `${FileSystem.documentDirectory}${MODEL_NAME}`;
}

async function getContext(): Promise<LlamaContext> {
  if (!contextPromise) {
    setStatus('loading');
    contextPromise = (async () => {
      const path = modelPath();
      const info = await FileSystem.getInfoAsync(path);
      if (!info.exists) await FileSystem.downloadAsync(MODEL_URL, path);
      const context = await initLlama({ model: path, n_ctx: 2048, n_gpu_layers: 99 });
      setStatus('ready');
      return context;
    })().catch((error) => {
      contextPromise = undefined;
      setStatus('error');
      console.warn('[local-ai] Unable to initialize the on-device model. Using deterministic fallback.', error);
      throw error;
    });
  }
  return contextPromise;
}

export async function generateLocalNpcText(npc: NPCProfile, prompt: string): Promise<string | undefined> {
  try {
    const context = await getContext();
    const result = await context.completion({
      messages: [
        {
          role: 'system',
          content: `You are ${npc.name}, a fictional social roleplay character. Your style is ${npc.speakingStyle}. Stay in character. Reply with one concise sentence, no narration, no hashtags, and no quotation marks.`,
        },
        { role: 'user', content: prompt },
      ],
      n_predict: 48,
      temperature: 0.8,
      top_p: 0.9,
      stop: STOP_WORDS,
    });
    const text = result.text.trim().replace(/^["']|["']$/g, '');
    return text || undefined;
  } catch (error) {
    console.warn('[local-ai] Generation failed. Using deterministic fallback.', error);
    return undefined;
  }
}

export function localAiModelName(): string {
  return MODEL_NAME;
}
