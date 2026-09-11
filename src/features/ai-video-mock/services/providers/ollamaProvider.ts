import type { AIProvider, AIProviderResponse } from '../../types/provider.types';

export class OllamaProvider implements AIProvider {
  name = 'Ollama (Local LLM)';
  private proxyBaseUrl: string;
  private directBaseUrl: string;
  private preferredModel: string;
  private resolvedModel: string | null = null;

  constructor(
    preferredModel = 'llama3.2:latest',
    proxyBaseUrl = '/api/ollama',
    directBaseUrl = 'http://localhost:11434'
  ) {
    this.preferredModel = preferredModel;
    this.proxyBaseUrl = proxyBaseUrl;
    this.directBaseUrl = directBaseUrl;
  }

  /**
   * Tries proxy first (no CORS), then direct localhost.
   */
  private async fetchEndpoint(path: string, options?: RequestInit): Promise<Response> {
    // 1. Try local dev server proxy
    try {
      const proxyRes = await fetch(`${this.proxyBaseUrl}${path}`, options);
      if (proxyRes.ok || proxyRes.status < 500) {
        return proxyRes;
      }
    } catch {}

    // 2. Direct fallback
    return fetch(`${this.directBaseUrl}/api${path}`, options);
  }

  async getInstalledModels(): Promise<string[]> {
    try {
      const res = await this.fetchEndpoint('/tags', {
        method: 'GET',
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        const data = await res.json();
        return (data.models || []).map((m: any) => m.name || m.model);
      }
    } catch {}
    return [];
  }

  async isAvailable(): Promise<{
    available: boolean;
    statusMessage: string;
    modelName?: string;
    allModels?: string[];
    baseUrl?: string;
  }> {
    try {
      const models = await this.getInstalledModels();
      if (models.length > 0) {
        // Resolve model: prefer configured preferredModel, or match llama3.2 variants, or use first installed
        let chosen = models.find(m => m === this.preferredModel || m.startsWith('llama3.2') || m.startsWith('llama3'));
        if (!chosen) chosen = models[0];

        this.resolvedModel = chosen;

        return {
          available: true,
          statusMessage: `Connected to Ollama on localhost:11434 (Active model: ${chosen})`,
          modelName: chosen,
          allModels: models,
          baseUrl: this.directBaseUrl,
        };
      }

      // Ollama might be reachable but has 0 models pulled
      return {
        available: false,
        statusMessage: 'Ollama is reachable, but no models are installed. Run: ollama pull llama3.2',
        baseUrl: this.directBaseUrl,
      };
    } catch (err: any) {
      return {
        available: false,
        statusMessage: `Ollama service is not reachable at ${this.directBaseUrl}. Ensure "ollama serve" is active.`,
        baseUrl: this.directBaseUrl,
      };
    }
  }

  async getActiveModel(): Promise<string> {
    if (this.resolvedModel) return this.resolvedModel;
    const status = await this.isAvailable();
    return status.modelName || this.preferredModel;
  }

  async generateCompletion(
    prompt: string,
    options?: { systemPrompt?: string; temperature?: number; jsonMode?: boolean }
  ): Promise<AIProviderResponse> {
    const startTime = Date.now();
    const model = await this.getActiveModel();
    const system = options?.systemPrompt || 'You are an expert FAANG Senior Staff Frontend Interviewer and Technical Evaluator.';

    try {
      const payload: Record<string, any> = {
        model,
        prompt,
        system,
        stream: false,
        options: {
          temperature: options?.temperature ?? 0.2,
        },
      };

      if (options?.jsonMode) {
        payload.format = 'json';
      }

      const res = await this.fetchEndpoint('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(90000), // 90s timeout
      });

      if (!res.ok) {
        throw new Error(`Ollama generation returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const content = (data.response || '').trim();
      let parsedJson: any = undefined;

      if (options?.jsonMode) {
        try {
          parsedJson = JSON.parse(content);
        } catch {
          // Attempt markdown extraction of JSON block
          const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              parsedJson = JSON.parse(jsonMatch[1] || jsonMatch[0]);
            } catch {}
          }
        }
      }

      return {
        success: true,
        content,
        parsedJson,
        model,
        durationMs: Date.now() - startTime,
      };
    } catch (err: any) {
      return {
        success: false,
        content: '',
        model,
        durationMs: Date.now() - startTime,
        error: err.message || 'Ollama connection failure',
      };
    }
  }
}

export const ollamaProvider = new OllamaProvider();

