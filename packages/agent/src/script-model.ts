import { SCRIPT_MODEL_ERROR } from "@lynk/shared";

type Usage = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
};

const usage: Usage = { inputTokens: 1, outputTokens: 1, totalTokens: 2 };

type ToolDirective = { name: string; input: string };

function collectText(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(collectText).join("\n");
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).map(collectText).join("\n");
  }
  return "";
}

function hasToolResult(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(hasToolResult);
  const record = value as Record<string, unknown>;
  if (record.type === "tool-result" || record.role === "tool") return true;
  return Object.values(record).some(hasToolResult);
}

function promptText(prompt: unknown): string {
  const direct = collectText(prompt);
  if (direct.includes("LYNK_TOOL") || direct.includes(SCRIPT_MODEL_ERROR)) return direct;
  try {
    return JSON.stringify(prompt).replace(/\\"/g, '"');
  } catch {
    return direct;
  }
}

function messagesOf(prompt: unknown): Array<{ role?: string; content?: unknown }> {
  if (Array.isArray(prompt)) return prompt as Array<{ role?: string; content?: unknown }>;
  if (prompt && typeof prompt === "object" && Array.isArray((prompt as { messages?: unknown }).messages)) {
    return (prompt as { messages: Array<{ role?: string; content?: unknown }> }).messages;
  }
  return [];
}

export function directiveFromPrompt(prompt: unknown): ToolDirective | "error" | null {
  const messages = messagesOf(prompt);
  let lastUser = -1;
  messages.forEach((message, index) => {
    if (message?.role === "user") lastUser = index;
  });
  const userText = lastUser >= 0 ? collectText(messages[lastUser]) : promptText(prompt);
  if (userText.includes(SCRIPT_MODEL_ERROR)) return "error";
  const laterTool = messages.slice(lastUser + 1).some((message) => hasToolResult(message));
  if (laterTool) return null;
  const match = userText.match(/LYNK_TOOL\s+([A-Za-z0-9_]+)\s+(\{.*\})/);
  if (!match?.[1] || !match[2]) return null;
  return { name: match[1], input: match[2] };
}

function generateContent(prompt: unknown) {
  const directive = directiveFromPrompt(prompt);
  if (directive === "error") {
    throw new Error("Scripted model failed on purpose.");
  }
  if (!directive) {
    return {
      content: [
        {
          type: "text" as const,
          text: "I only act on an explicit Lynk tool request. I ignored any other instructions in that message.",
        },
      ],
      finishReason: "stop" as const,
    };
  }
  return {
    content: [
      {
        type: "tool-call" as const,
        toolCallId: `script-${directive.name}`,
        toolName: directive.name,
        input: directive.input,
      },
    ],
    finishReason: "tool-calls" as const,
  };
}

function streamFromContent(content: { type: string; text?: string; toolCallId?: string; toolName?: string; input?: string }[], finishReason: string) {
  const chunks: Record<string, unknown>[] = [{ type: "stream-start", warnings: [] }];
  for (const part of content) {
    if (part.type === "text" && part.text) {
      chunks.push({ type: "text-start", id: "text-1" });
      chunks.push({ type: "text-delta", id: "text-1", delta: part.text });
      chunks.push({ type: "text-end", id: "text-1" });
    }
    if (part.type === "tool-call" && part.toolCallId && part.toolName && part.input) {
      chunks.push({ type: "tool-input-start", id: part.toolCallId, toolName: part.toolName });
      chunks.push({ type: "tool-input-delta", id: part.toolCallId, delta: part.input });
      chunks.push({ type: "tool-input-end", id: part.toolCallId });
      chunks.push({
        type: "tool-call",
        toolCallId: part.toolCallId,
        toolName: part.toolName,
        input: part.input,
      });
    }
  }
  chunks.push({ type: "finish", finishReason, usage });
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(chunk);
      controller.close();
    },
  });
}

/** Deterministic stand-in for the OpenAI model. It emits the requested tool call and nothing else. */
export function createScriptModel() {
  return {
    specificationVersion: "v2" as const,
    provider: "lynk-script",
    modelId: "script",
    supportedUrls: {} as Record<string, RegExp[]>,
    async doGenerate(options: { prompt: unknown }) {
      const generated = generateContent(options.prompt);
      return { ...generated, usage, warnings: [] };
    },
    async doStream(options: { prompt: unknown }) {
      const generated = generateContent(options.prompt);
      return {
        stream: streamFromContent(generated.content, generated.finishReason),
        warnings: [],
      };
    },
  };
}
