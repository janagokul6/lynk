import { EventEmitter } from "node:events";

export type DomainEvent =
  | { type: "creator.synced"; creatorId: string; platform: string }
  | { type: "connection.upserted"; userId: string; platform: string }
  | { type: "tool.invoked"; tool: string; userId?: string };

class DomainBus extends EventEmitter {
  emitEvent(event: DomainEvent): void {
    this.emit(event.type, event);
    this.emit("*", event);
  }
}

export const domainEvents = new DomainBus();
