import { LLMProvider, STTProvider, TTSProvider } from './types'

const registry = new Map<string, LLMProvider>()

export function registerProvider(provider: LLMProvider) {
  registry.set(provider.name, provider)
}

export function getProvider(name: string): LLMProvider {
  const p = registry.get(name)
  if (!p) throw new Error(`LLM provider not registered: ${name}`)
  return p
}

export function listProviders(): string[] {
  return Array.from(registry.keys())
}

const sttRegistry = new Map<string, STTProvider>()
const ttsRegistry = new Map<string, TTSProvider>()

export function registerSTTProvider(provider: STTProvider) {
  sttRegistry.set(provider.name, provider)
}

export function getSTTProvider(name: string): STTProvider {
  const p = sttRegistry.get(name)
  if (!p) throw new Error(`STT provider not registered: ${name}`)
  return p
}

export function listSTTProviders(): string[] {
  return Array.from(sttRegistry.keys())
}

export function registerTTSProvider(provider: TTSProvider) {
  ttsRegistry.set(provider.name, provider)
}

export function getTTSProvider(name: string): TTSProvider {
  const p = ttsRegistry.get(name)
  if (!p) throw new Error(`TTS provider not registered: ${name}`)
  return p
}

export function listTTSProviders(): string[] {
  return Array.from(ttsRegistry.keys())
}


