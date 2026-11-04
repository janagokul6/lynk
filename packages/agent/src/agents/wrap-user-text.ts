import type { MastraDBMessage } from "@mastra/core/agent/message-list";

export const USER_DATA_START = "<<<USER_DATA>>>";
export const USER_DATA_END = "<<<END_USER_DATA>>>";

type TextPart = { type?: string; text?: string };
type UserMessage = { role?: string; content?: string | TextPart[] | unknown };

export function wrapUserData(text: string): string {
  if (text.includes(USER_DATA_START) && text.includes(USER_DATA_END)) return text;
  const stripped = text.split(USER_DATA_START).join("").split(USER_DATA_END).join("");
  return `${USER_DATA_START}\n${stripped}\n${USER_DATA_END}`;
}

function wrapContent(content: UserMessage["content"]): UserMessage["content"] {
  if (typeof content === "string") return wrapUserData(content);
  if (!Array.isArray(content)) return content;
  return content.map((part) => {
    if (part && typeof part === "object" && typeof part.text === "string") {
      return { ...part, text: wrapUserData(part.text) };
    }
    return part;
  });
}

export function wrapUserMessages<T extends UserMessage>(messages: T[]): T[] {
  return messages.map((message) => {
    if (message.role !== "user") return message;
    return { ...message, content: wrapContent(message.content) };
  });
}

export const wrapUserTextProcessor = {
  id: "wrap-user-text",
  name: "Wrap user text",
  processInput({ messages }: { messages: MastraDBMessage[] }): MastraDBMessage[] {
    return messages.map((message) => {
      if (message.role !== "user") return message;
      const wrapped = wrapUserMessages([message])[0];
      if (!wrapped) return message;
      return { ...message, content: wrapped.content as MastraDBMessage["content"] };
    });
  },
};
