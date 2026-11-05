const DIMS = 1536;

function hashToken(token: string): number {
  let h = 2166136261;
  for (let i = 0; i < token.length; i++) {
    h = Math.imul(h ^ token.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

/** Deterministic local embedding. Used when OPENAI_API_KEY is unset or the provider fails. */
export function embedText(text: string, dims = DIMS): number[] {
  const vec = new Array<number>(dims).fill(0);
  const tokens = text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

  for (const token of tokens) {
    const h = hashToken(token);
    const i = h % dims;
    vec[i] += 1;
    vec[(i + 97) % dims] += 0.5;
    vec[(i + 389) % dims] += 0.25;
  }

  let norm = 0;
  for (const v of vec) norm += v * v;
  norm = Math.sqrt(norm) || 1;
  return vec.map((v) => v / norm);
}

export async function resolveEmbedding(text: string): Promise<number[]> {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (key) {
    try {
      const response = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "text-embedding-3-small",
          input: text.slice(0, 8000),
        }),
      });
      if (response.ok) {
        const json = (await response.json()) as { data?: { embedding?: number[] }[] };
        const embedding = json.data?.[0]?.embedding;
        if (embedding && embedding.length === DIMS) return embedding;
      }
    } catch {
      // Hash fallback keeps search available when the provider is down.
    }
  }
  return embedText(text);
}

export function vectorLiteral(values: number[]): string {
  return `[${values.join(",")}]`;
}
