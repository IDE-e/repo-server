import { Injectable } from "@nestjs/common";
import { ClusterStatus, type ClusterSummary } from "./cluster.type";
import type { ClusterPatchDto } from "./dto/cluster-patch.dto";
import { getGlobalSingleton } from "src/common/global-singleton";

type MockClusterStore = {
  summary: ClusterSummary;
  intervalId?: NodeJS.Timeout;
};

const STORE_KEY = "__mockCluster";

function makeSeed(): ClusterSummary {
  return {
    clusterName: "local-kafka",
    status: ClusterStatus.HEALTHY,
    brokers: 3,
    topics: 18,
    partitions: 96,
    underReplicated: 0,
    messageInPerSec: 1200,
    messageOutPerSec: 1180,
    storageUsedGB: 320,
    storageTotalGB: 1024,
    updatedAt: new Date().toISOString(),
  };
}

function computeStatus(underReplicated: number): ClusterStatus {
  if (underReplicated === 0) return ClusterStatus.HEALTHY;
  if (underReplicated <= 1) return ClusterStatus.DEGRADED;
  return ClusterStatus.DOWN;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function definedOnly<T extends object>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) (out as any)[k] = v;
  }
  return out;
}

@Injectable()
export class ClusterService {
  private readonly store = getGlobalSingleton<MockClusterStore>(
    STORE_KEY,
    () => ({
      summary: makeSeed(),
    })
  );

  constructor() {
    this.ensureWobble();
  }

  getSummary(): ClusterSummary {
    return { ...this.store.summary };
  }

  updatePartial(dto: ClusterPatchDto): ClusterSummary {
    const patch = definedOnly(dto);

    const current = this.store.summary;
    const merged: ClusterSummary = {
      ...current,
      ...(patch as any),
      updatedAt: new Date().toISOString(),
    };

    // storage clamp (used <= total)
    const total = Math.max(1, merged.storageTotalGB);
    const used = clamp(Math.max(1, merged.storageUsedGB), 1, total);

    merged.storageTotalGB = total;
    merged.storageUsedGB = used;

    // status rule (server-derived)
    merged.status = computeStatus(merged.underReplicated);

    this.store.summary = merged;
    return { ...merged };
  }

  private ensureWobble() {
    // dev/HMR에서 서비스가 재생성돼도 interval 하나만 돌게
    if (this.store.intervalId) return;

    this.store.intervalId = setInterval(() => {
      const s = this.store.summary;

      // underReplicated: 확률적으로 0/1/2
      const r = Math.random();
      const under = r < 0.72 ? 0 : r < 0.93 ? 1 : 2;

      // message rates wobble (min 100)
      const inRate = Math.max(100, s.messageInPerSec + randInt(-180, 180));
      const outRate = Math.max(100, s.messageOutPerSec + randInt(-180, 180));

      // storage wobble (min 1, max total)
      const total = Math.max(1, s.storageTotalGB);
      const used = clamp(
        Math.max(1, s.storageUsedGB + randInt(-8, 18)),
        1,
        total
      );

      const next: ClusterSummary = {
        ...s,
        underReplicated: under,
        messageInPerSec: inRate,
        messageOutPerSec: outRate,
        storageTotalGB: total,
        storageUsedGB: used,
        status: computeStatus(under),
        updatedAt: new Date().toISOString(),
      };

      this.store.summary = next;
    }, 5000);
  }
}
