import { TopicEntryDto } from "./dto/topics.dto";

export function seedTopics(): TopicEntryDto[] {
  const now = new Date().toISOString();

  return [
    {
      name: "orders",
      partitions: 10,
      replicationFactor: 2,
      messageInPerSec: 180,
      messageOutPerSec: 165,
      lag: 42,
      sizeGB: 18,
      updatedAt: now,
    },
    {
      name: "payments",
      partitions: 8,
      replicationFactor: 2,
      messageInPerSec: 120,
      messageOutPerSec: 118,
      lag: 12,
      sizeGB: 9,
      updatedAt: now,
    },
    {
      name: "users",
      partitions: 6,
      replicationFactor: 2,
      messageInPerSec: 60,
      messageOutPerSec: 58,
      lag: 4,
      sizeGB: 6,
      updatedAt: now,
    },
    {
      name: "logs",
      partitions: 6,
      replicationFactor: 2,
      messageInPerSec: 20,
      messageOutPerSec: 20,
      lag: 0,
      sizeGB: 3,
      updatedAt: now,
    },
    {
      name: "metrics",
      partitions: 6,
      replicationFactor: 2,
      messageInPerSec: 15,
      messageOutPerSec: 14,
      lag: 1,
      sizeGB: 2,
      updatedAt: now,
    },
    {
      name: "notifications",
      partitions: 12,
      replicationFactor: 3,
      messageInPerSec: 75,
      messageOutPerSec: 70,
      lag: 9,
      sizeGB: 7,
      updatedAt: now,
    },
    {
      name: "analytics",
      partitions: 18,
      replicationFactor: 2,
      messageInPerSec: 95,
      messageOutPerSec: 90,
      lag: 18,
      sizeGB: 22,
      updatedAt: now,
    },
  ];
}
