export enum BrokerStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
  DEGRADED = "DEGRADED",
}

export type BrokerEntry = {
  id: number;
  host: string;
  rack?: string;
  status: BrokerStatus;
  cpu: number; // %
  memory: number; // %
  disk: number; // %
  networkIn: number; // MB/s
  networkOut: number; // MB/s
  updatedAt: string;
};

export function makeSeedBrokers(count = 3): BrokerEntry[] {
  const now = new Date().toISOString();

  return Array.from({ length: count }, (_, i) => {
    const id = i + 1;
    return {
      id,
      host: `broker-${id}.local`,
      rack: `rack-${(i % 2) + 1}`,
      status: BrokerStatus.ONLINE,
      cpu: 10,
      memory: 20,
      disk: 30,
      networkIn: 5,
      networkOut: 5,
      updatedAt: now,
    };
  });
}
