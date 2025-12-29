export enum ClusterStatus {
  HEALTHY = "HEALTHY",
  DEGRADED = "DEGRADED",
  DOWN = "DOWN",
}

export type ClusterSummary = {
  clusterName: string;
  status: ClusterStatus;
  brokers: number;
  topics: number;
  partitions: number;
  underReplicated: number;
  messageInPerSec: number;
  messageOutPerSec: number;
  storageUsedGB: number;
  storageTotalGB: number;
  updatedAt: string;
};
