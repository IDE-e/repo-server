import { Injectable, OnModuleInit } from "@nestjs/common";
import { getTopicsStore, getTopicsTicker } from "./topics.store";
import { seedTopics } from "./topics.seed";
import { TopicEntryDto } from "./dto/topics.dto";

type CreateTopicInput = {
  name?: unknown;
  partitions?: unknown;
  replicationFactor?: unknown;
  messageInPerSec?: unknown;
  messageOutPerSec?: unknown;
  lag?: unknown;
  sizeGB?: unknown;
};

function clampMin(n: number, min: number) {
  return Math.max(min, n);
}

function wobbleInt(n: number, delta: number, min: number) {
  const next = Math.round(n + (Math.random() * (delta * 2) - delta));
  return clampMin(next, min);
}

@Injectable()
export class TopicsService implements OnModuleInit {
  onModuleInit() {
    this.ensureTicker();
  }

  private ensureTicker() {
    const ticker = getTopicsTicker();
    if (ticker.started) return;

    ticker.started = true;
    ticker.timer = setInterval(() => {
      const store = getTopicsStore();
      const now = new Date().toISOString();

      store.topics = store.topics.map((t) => ({
        ...t,
        messageInPerSec: wobbleInt(t.messageInPerSec, 25, 0),
        messageOutPerSec: wobbleInt(t.messageOutPerSec, 25, 0),
        lag: wobbleInt(t.lag, 60, 0),
        sizeGB: wobbleInt(t.sizeGB, 1, 1),
        updatedAt: now,
      }));
    }, 5000);
  }

  list(): TopicEntryDto[] {
    const store = getTopicsStore();
    return structuredClone(store.topics);
  }

  findByName(name: string): TopicEntryDto | undefined {
    const store = getTopicsStore();
    const found = store.topics.find((t) => t.name === name);
    return found ? structuredClone(found) : undefined;
  }

  create(input: CreateTopicInput): {
    created: TopicEntryDto;
    alreadyExists: boolean;
  } {
    const store = getTopicsStore();

    const name = typeof input.name === "string" ? input.name.trim() : "";
    if (!name) {
      return {
        alreadyExists: false,
        created: {
          name: "",
          partitions: 6,
          replicationFactor: 2,
          messageInPerSec: 0,
          messageOutPerSec: 0,
          lag: 0,
          sizeGB: 1,
          updatedAt: new Date().toISOString(),
        },
      };
    }

    if (store.topics.some((t) => t.name === name)) {
      return {
        alreadyExists: true,
        created: structuredClone(store.topics.find((t) => t.name === name)!),
      };
    }

    const topic: TopicEntryDto = {
      name,
      partitions:
        typeof input.partitions === "number" ? Math.round(input.partitions) : 6,
      replicationFactor:
        typeof input.replicationFactor === "number"
          ? Math.round(input.replicationFactor)
          : 2,
      messageInPerSec:
        typeof input.messageInPerSec === "number"
          ? Math.round(input.messageInPerSec)
          : 0,
      messageOutPerSec:
        typeof input.messageOutPerSec === "number"
          ? Math.round(input.messageOutPerSec)
          : 0,
      lag: typeof input.lag === "number" ? Math.round(input.lag) : 0,
      sizeGB: typeof input.sizeGB === "number" ? Math.round(input.sizeGB) : 1,
      updatedAt: new Date().toISOString(),
    };

    topic.lag = clampMin(topic.lag, 0);
    topic.sizeGB = clampMin(topic.sizeGB, 1);
    topic.messageInPerSec = clampMin(topic.messageInPerSec, 0);
    topic.messageOutPerSec = clampMin(topic.messageOutPerSec, 0);

    store.topics.push(topic);
    return { alreadyExists: false, created: structuredClone(topic) };
  }

  reset(): { resetCount: number } {
    const store = getTopicsStore();
    const resetCount = store.topics.length;
    store.topics = seedTopics();
    return { resetCount };
  }
}
