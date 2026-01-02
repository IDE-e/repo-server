export class TopicEntryDto {
  name!: string;
  partitions!: number;
  replicationFactor!: number;
  messageInPerSec!: number;
  messageOutPerSec!: number;
  lag!: number;
  sizeGB!: number;
  updatedAt!: string; // ISO-8601
}
