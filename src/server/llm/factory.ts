import { LLMProvider } from './types'

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


